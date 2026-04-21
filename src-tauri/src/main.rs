// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use axum::{extract::State, routing::{get, post}, Json, Router};
use local_ip_address::local_ip;
use serde_json::{json, Value};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tauri::{AppHandle, Emitter};

// 1. Tauri Command to get the IP address
#[tauri::command]
fn get_sync_connection_string() -> Result<String, String> {
    match local_ip() {
        Ok(ip) => Ok(format!("http://{}:8080", ip)),
        Err(e) => Err(format!("Could not get local IP: {}", e)),
    }
}

// 2. The POST route handler that receives the mobile data
async fn handle_sync_data(
    State(app): State<AppHandle>,
    Json(payload): Json<Value>,
) -> Json<Value> {
    // Emit a custom native event to the React frontend containing the mobile data
    println!("Received sync payload from mobile!");
    app.emit("vault-sync-received", payload).unwrap();
    
    Json(json!({ "status": "success", "message": "Data transferred securely." }))
}

// 3. The Local Background Server
async fn start_local_server(app_handle: AppHandle) {
    let app = Router::new()
        .route("/ping", get(|| async { 
            Json(json!({ "status": "NeuroKey Desktop is ready!", "device": "Desktop" })) 
        }))
        // Add the new POST route and share the Tauri app handle with it
        .route("/sync", post(handle_sync_data))
        .with_state(app_handle)
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("Sync server listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle().clone();
            // Spin up the Axum server in a background thread with the app handle
            tauri::async_runtime::spawn(async move {
                start_local_server(app_handle).await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_sync_connection_string])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}