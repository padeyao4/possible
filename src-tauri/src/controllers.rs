use std::{
    fs::{self, File},
    io::Write,
    path::PathBuf,
};

use git2::{Cred, IndexAddOption, RemoteCallbacks, Repository};
use serde_json::from_str;
use tauri::{api, command};

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum GitAuthMethod {
    Password,
    Key,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ConfigFile {
    base_path: PathBuf,
    data_dir: String,
    config_file_name: String,
    remote_enable: bool,
    git_enable: bool,
    git_auth_method: GitAuthMethod,
    git_url: String,
    git_username: String,
    git_password: String,
    git_ssh_key: PathBuf,
}

impl ConfigFile {
    pub fn default() -> Self {
        Self {
            base_path: get_base_path().unwrap(),
            data_dir: String::from("data"),
            config_file_name: String::from("config.json"),
            remote_enable: false,
            git_enable: false,
            git_url: "".to_owned(),
            git_username: "".to_owned(),
            git_password: "".to_owned(),
            git_ssh_key: PathBuf::new(),
            git_auth_method: GitAuthMethod::Key,
        }
    }
}

fn get_base_path() -> Option<PathBuf> {
    let context = tauri::generate_context!();
    let config = context.config();
    api::path::app_data_dir(config)
}

#[command(async)]
pub fn read_config() -> ConfigFile {
    let config_path = get_base_path().map(|f| {
        let mut o = f.clone();
        o.push("config.json");
        o
    });

    return match config_path {
        Some(path) => {
            if path.is_file() {
                let s = fs::read_to_string(path).unwrap();
                from_str(&s).unwrap()
            } else {
                ConfigFile::default()
            }
        }
        None => ConfigFile::default(),
    };
}

#[command(async)]
pub fn write_config(config: ConfigFile) {
    let config_path = get_base_path()
        .map(|f| {
            let mut o = f.clone();
            o.push("config.json");
            o
        })
        .unwrap();
    let mut file = File::create(config_path).unwrap();
    let json = serde_json::to_string_pretty(&config).unwrap();
    file.write_all(json.as_bytes()).unwrap();
}

#[command(async)]
pub fn clone_repository() -> bool {
    let config = read_config();

    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, username_from_url, _allowed_types| {
        return match config.git_auth_method {
            GitAuthMethod::Password => {
                Cred::userpass_plaintext(&config.git_username, &config.git_password)
            }
            GitAuthMethod::Key => Cred::ssh_key(
                username_from_url.unwrap(),
                None,
                config.git_ssh_key.as_path(),
                None,
            ),
        };
    });

    // Prepare fetch options.
    let mut fo = git2::FetchOptions::new();
    fo.remote_callbacks(callbacks);

    // Prepare builder.
    let mut builder = git2::build::RepoBuilder::new();
    builder.fetch_options(fo);

    // Clone the project.
    let repository = builder.clone(&config.git_url, &config.base_path.join(config.data_dir));

    match repository {
        Ok(_repo) => {
            println!("Successfully cloned repository");
            return true;
        }
        Err(e) => {
            println!("Failed to clone repository: {}", e);
            return false;
        }
    }
}

#[command(async)]
pub fn git_add_and_commit() {
    let config = read_config();
    let repo = Repository::open(&config.base_path.join(config.data_dir)).unwrap();
    let mut index = repo.index().unwrap();

    index
        .add_all(["."].iter(), IndexAddOption::DEFAULT, None)
        .unwrap();

    let oid = index.write_tree().unwrap();
    let tree = repo.find_tree(oid).unwrap();

    let author = repo.signature().unwrap();

    let head = repo.head().unwrap();
    let parent = repo.find_commit(head.target().unwrap()).unwrap();

    repo.commit(
        Some("HEAD"),
        &author,
        &author,
        "",
        &tree,
        &[&parent],
    )
    .unwrap();

    index
        .add_all(["."].iter(), IndexAddOption::DEFAULT, None)
        .unwrap();

    index.write().unwrap();
}
