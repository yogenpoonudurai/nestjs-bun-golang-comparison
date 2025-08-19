use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};

#[get("/")]
async fn get_hello() -> impl Responder {
    HttpResponse::Ok().body("Hello, from Rust")
}

#[get("/complex")]
async fn get_complex() -> impl Responder {
    let mut sum: i64 = 0;
    for i in 0..1000000 {
        sum += i;
    }
    HttpResponse::Ok().body(format!("Complex calculation result: {}", sum))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(get_hello)
            .service(get_complex)
    })
    .bind(("127.0.0.1", 3004))?
    .run()
    .await
}
