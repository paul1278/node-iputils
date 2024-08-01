const CONSTANTS = require("./Constants");
const { InvalidIPError } = require("./Errors");

/**
 * This class is responsible for storing an IP-address.
 * It automatically resolves the type and you can use the same class for IPv4 and IPv6 addresses.
 */
class IPSubnet {
  /**
   * The constructor validates the given address and stores it maximized.
   * @param {IPAddress} parent The parent IP address from which this subnet is generated.
   */
  constructor(parent) {
    this.parent = parent;
    this.ip = this.parent.applyMask();
  }

  /**
   * This function checks if the given address is of the same type as the parent.
   * @param {IPAddress} address The address to check.
   * @throws {InvalidIPError} If the address is of a different type.
   */
  isMatchingType(address) {
    if (this.parent.type !== address.type) {
      throw new InvalidIPError("IP address type does not match");
    }
  }

  /**
   * This function checks if the given address is in the subnet.
   * @param {IPAddress} address The address to check.
   * @returns {boolean} True if the address is in the subnet, false otherwise.
   */
  isInSubnet(address) {
    this.isMatchingType(address);

    let addressSubnetted = address.asNumber();
    return (
      addressSubnetted >= this.ip.asNumber() &&
      addressSubnetted <= this.getBiggestIPAsNumber()
    );
  }

  /**
   * This function returns the biggest IP address in the subnet as a number.
   * @returns {bigint} The biggest IP address in the subnet as a number.
   */
  getBiggestIPAsNumber() {
    let bits =
      this.parent.type == 4
        ? CONSTANTS.IPV4_BITS_PER_GROUP
        : CONSTANTS.IPV6_BITS_PER_GROUP;
    let octets =
      this.parent.type == 4
        ? CONSTANTS.IPV4_OCTET_GROUPS
        : CONSTANTS.IPV6_OCTET_GROUPS;
    return (
      this.ip.asNumber() +
      BigInt(Math.pow(2, octets * bits - this.parent.net)) -
      1n
    );
  }

  /**
   * This function returns the smallest IP address in the subnet as a number.
   * @returns {bigint} The smallest IP address in the subnet as a number.
   */
  getSmallestIPAsNumber() {
    return this.ip.asNumber();
  }
}

module.exports = IPSubnet;
