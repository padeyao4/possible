// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, CustomMenuItem, Manager, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, Window};
use tauri::SystemTray;
use webbrowser;
use window_shadows::set_shadow;

fn main() {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("open".to_string(), "打开"))
        .add_item(CustomMenuItem::new("feedback".to_string(), "反馈"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "退出"));

    let tray = SystemTray::new().with_menu(tray_menu).with_tooltip("Possible_v2 for windows");

    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).unwrap();
            Ok(())
        })
        .system_tray(tray)
        .on_system_tray_event(system_tray_handle)
        .invoke_handler(tauri::generate_handler![greet])
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn open_main_window(window: &Window) {
    window.show().unwrap();
    window.unminimize().unwrap();
    window.set_focus().unwrap();
}

fn system_tray_handle(app: &AppHandle, event: SystemTrayEvent) {
    let window = app.get_window("main").unwrap();
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
                "quit" => app.exit(0),
                "feedback" => {
                    let url = "https://github.com/padeyao4/possible/issues";
                    webbrowser::open(url).unwrap();
                }
                "open" => open_main_window(&window),
                _ => {}
            }
        }
        SystemTrayEvent::LeftClick { .. } => open_main_window(&window),
        SystemTrayEvent::RightClick { .. } => {}
        SystemTrayEvent::DoubleClick { .. } => {}
        _ => {}
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
