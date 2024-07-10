const CONSTANTS = require("./Constants");
const { InvalidIPError, InvalidConversionError } = require("./Errors");

/**
 * This class is responsible for storing an IP-address.
 * It automatically resolves the type and you can use the same class for IPv4 and IPv6 addresses.
 */
class IPSubnet {
  /**
   * The constructor validates the given address and stores it maximized.
   * @param {string} ip The IP-address to store.
   * @param {string} net The network mask to store.
   * @param parent
   */
  constructor(parent) {
    this.parent = parent;
    this.ip = this.parent.applyMask();
  }

  /**
   *
   * @param address
   */
  isMatchingType(address) {
    if (this.parent.type !== address.type) {
      throw new InvalidIPError("IP address type does not match");
    }
  }

  /**
   *
   * @param address
   */
  isInSubnet(address) {
    this.isMatchingType(address);

    let addressSubnetted = address.asNumber();
    return (
      addressSubnetted >= this.ip.asNumber() &&
      addressSubnetted <= this.biggestIP()
    );
  }

  /**
   *
   */
  biggestIP() {
    let bits =
      this.parent.type == 4
        ? CONSTANTS.IPV4_BITS_PER_GROUP
        : CONSTANTS.IPV6_BITS_PER_GROUP;
    let octets =
      this.parent.type == 4 ? CONSTANTS.IPV4_OCTETS : CONSTANTS.IPV6_OCTETS;
    return (
      this.ip.asNumber() +
      BigInt(Math.pow(2, octets * bits - this.parent.net)) -
      1n
    );
  }
}

module.exports = IPSubnet;
