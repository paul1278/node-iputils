/**
 *
 */
class IPSubnet {
  /**
   *
   * @param ip
   * @param mask
   */
  constructor(ip, mask) {
    this.ip = ip;
    if (ip.includes(":")) {
      this.octets = ip
        .split(":")
        .map((doubleoctet) => parseInt(doubleoctet, 16));
      this.bits = 16;
    } else {
      this.octets = ip.split(".").map((octet) => parseInt(octet, 10));
      this.bits = 8;
    }
    this.mask = mask;
    this.maskAsNumber =
      BigInt(Math.pow(2, this.octets.length * this.bits)) -
      BigInt(Math.pow(2, this.octets.length * this.bits - this.mask));
    this.subnettedIp = this.asNumber() & this.maskAsNumber;
  }

  /**
   * Checks if the given address is in the subnet.
   * @param {IPv4Address|IPv6Address} address - The address to check.
   * @returns {boolean} - True if the address is in the subnet, false otherwise.
   */
  isInSubnet(address) {}

  /**
   *
   */
  biggestIP() {
    return (
      this.subnettedIp +
      BigInt(Math.pow(2, this.octets.length * this.bits - this.mask)) -
      BigInt(1)
    );
  }

  /**
   *
   */
  asNumber() {
    return this.octets.reduce((acc, octet, index) => {
      return (
        BigInt(acc) +
        BigInt(
          octet *
            Math.pow(
              this.bits == 16 ? 65536 : 256,
              this.octets.length - 1 - index,
            ),
        )
      );
    }, 0);
  }
}

module.exports = { IPSubnet, IPv4Address, IPv6Address };
