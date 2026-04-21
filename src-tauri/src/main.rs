// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use axum::{routing::get, Router, Json};
use local_ip_address::local_ip;
use serde_json::json;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

// 1. A Tauri Command to send the IP address to the React frontend
#[tauri::command]
fn get_sync_connection_string() -> Result<String, String> {
    match local_ip() {
        Ok(ip) => Ok(format!("http://{}:8080", ip)),
        Err(e) => Err(format!("Could not get local IP: {}", e)),
    }
}

// 2. The Local Background Server
async fn start_local_server() {
    // Create a simple route so the mobile app can "ping" the desktop
    let app = Router::new()
        .route("/ping", get(|| async { 
            Json(json!({ "status": "NeuroKey Desktop is ready!", "device": "Desktop" })) 
        }))
        // Allow the mobile app to connect without CORS errors
        .layer(CorsLayer::permissive());

    // Listen on port 8080 on all network interfaces
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("Sync server listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn main() {
    // 3. Spin up the Axum server in a background thread
    tauri::async_runtime::spawn(async {
        start_local_server().await;
    });

    // 4. Start the Tauri application
    tauri::Builder::default()
        // Register our command so React can call it
        .invoke_handler(tauri::generate_handler![get_sync_connection_string])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}