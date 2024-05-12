namespace AdGuard {
  export async function downlaodIOS() {
    try {
      const res = await fetch(
        "https://adguard-dns.io/public_api/v1/dns/mobile_config",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dns_proto_type: "DOH",
            filtering_type: "DEFAULT",
          }),
        },
      );
      const data = await res.json();
      if (data.download_link) {
        window.open("https://adguard-dns.io" + data.download_link);
        return true;
      }
    } catch (_) {}
    return false;
  }

  export async function downlaodMacOS() {
    return downlaodIOS();
  }
}

export default AdGuard;
