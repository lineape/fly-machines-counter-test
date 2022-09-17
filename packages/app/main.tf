terraform {
  required_providers {
    fly = {
      source  = "fly-apps/fly"
      version = "0.0.16"
    }
  }
}

provider "fly" {

}

resource "fly_app" "api" {
  name = "eli-test-api"
  org  = "personal"
}

resource "fly_ip" "apiIpv4" {
  app        = "eli-test-api"
  type       = "v4"
  depends_on = [fly_app.api]
}

resource "fly_ip" "apiIpv6" {
  app        = "eli-test-api"
  type       = "v6"
  depends_on = [fly_app.api]
}

resource "fly_machine" "server" {
  name   = "api-server"
  app    = "eli-test-api"
  region = "sea"
  image  = "elikellendonk/test-repo:latest"

  cpus     = 1
  memorymb = 256

  services = [
    {
      ports = [
        { port = 443, handlers = ["tls", "http"] },
        { port = 80, handlers = ["http"] }
      ]
      protocol      = "tcp",
      internal_port = 3000
    }
  ]

  env = {}

  depends_on = [fly_app.api]
}


output "ip4" {
  // noinspection HILUnresolvedReference
  value = fly_ip.apiIpv4.address
}
