// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use axum::{extract::State, routing::{get, post}, Json, Router};
use local_ip_address::local_ip;
use serde_json::{json, Value};
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};
use tower_http::cors::CorsLayer;
use tauri::{AppHandle, Emitter, Manager};

// 1. Create a thread-safe storage for the Desktop's vault
struct SharedVault(Arc<Mutex<Value>>);

#[tauri::command]
fn get_sync_connection_string() -> Result<String, String> {
    match local_ip() {
        Ok(ip) => Ok(format!("http://{}:8080", ip)),
        Err(e) => Err(format!("Could not get local IP: {}", e)),
    }
}

// 2. NEW: React calls this right before showing the QR code to seed the memory bank
#[tauri::command]
fn seed_desktop_vault(vault: Value, state: tauri::State<SharedVault>) {
    let mut v = state.0.lock().unwrap();
    *v = vault;
    println!("✅ Desktop vault loaded into Rust memory bank.");
}

// 3. UPDATED: Receives mobile data AND returns desktop data!
async fn handle_sync_data(
    State((app, vault_mutex)): State<(AppHandle, Arc<Mutex<Value>>)>,
    Json(mobile_payload): Json<Value>,
) -> Json<Value> {
    // Grab the Desktop vault from memory
    let desktop_vault = vault_mutex.lock().unwrap().clone();
    
    // Emit the Mobile vault to React so the desktop can merge it
    println!("Received sync payload from mobile!");
    app.emit("vault-sync-received", mobile_payload).unwrap();
    
    // Return the Desktop vault to the Mobile app!
    Json(json!({ 
        "status": "success", 
        "message": "Data transferred securely.",
        "desktop_items": desktop_vault 
    }))
}

// 4. The Local Background Server
async fn start_local_server(app_handle: AppHandle, shared_vault: Arc<Mutex<Value>>) {
    let app = Router::new()
        .route("/ping", get(|| async { 
            Json(json!({ "status": "NeuroKey Desktop is ready!", "device": "Desktop" })) 
        }))
        .route("/sync", post(handle_sync_data))
        .with_state((app_handle, shared_vault)) // Pass both app handle and vault memory
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("Sync server listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn main() {
    // Initialize the empty memory bank
    let shared_vault = Arc::new(Mutex::new(json!([])));

    tauri::Builder::default()
        .manage(SharedVault(shared_vault.clone())) // Give Tauri access to it
        .setup(|app| {
            let app_handle = app.handle().clone();
            // Spin up the Axum server in a background thread
            tauri::async_runtime::spawn(async move {
                start_local_server(app_handle, shared_vault).await;
            });
            Ok(())
        })
        // Make sure seed_desktop_vault is registered here!
        .invoke_handler(tauri::generate_handler![get_sync_connection_string, seed_desktop_vault])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}