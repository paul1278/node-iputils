const { isIP } = require("net");
const { InvalidIPError, InvalidConversionError } = require("./Errors");
const IPSubnet = require("./IPSubnet");
const CONSTANTS = require("./Constants");

/**
 * This class is responsible for storing an IP-address.
 * It automatically resolves the type and you can use the same class for IPv4 and IPv6 addresses.
 */
class IPAddress {
  /**
   * The constructor validates the given address and stores it maximized.
   * @param {string} ip The IP-address to store.
   * @param {string} net The network mask to store.
   */
  constructor(ip, net) {
    this.type = isIP(ip);
    if (this.type === 0) {
      throw new InvalidIPError(ip, net);
    }
    this.ip = ip;
    this.ip = this.maximize();

    net = +net;
    if (
      isNaN(net) ||
      net < 0 ||
      net >
        (this.type === 4 ? CONSTANTS.IPV4_MASK_MAX : CONSTANTS.IPV6_MASK_MAX)
    ) {
      throw new InvalidIPError(ip, net);
    }
    this.net = net;

    this.octets = this.ip
      .split(this.type === 4 ? "." : ":")
      .map((octet) =>
        parseInt(
          octet,
          this.type == 4
            ? CONSTANTS.IPV4_OCTET_CODING
            : CONSTANTS.IPV6_OCTET_CODING,
        ),
      );
  }

  /**
   * This function generates a minimized version of the IP-address.
   * IPv4: It will remove nothing.
   * IPv6: It will remove leading zeros and replace a group of of zeros with "::".
   * @returns {string} The minimized IP-address.
   */
  minimize() {
    if (this.type == 4) {
      return this.ip;
    }
    let octets = this.ip.split(":");
    let maxStart = 0;
    let maxEnd = 0;
    let currentStart = 0;
    let currentEnd = 0;

    for (let i = 0; i < octets.length; i++) {
      if (parseInt(octets[i], 16) === 0) {
        octets[i] = 0;
        if (currentStart === 0) {
          currentStart = i;
        }
        currentEnd = i;
      } else {
        octets[i] = octets[i].replace(/^0+/, "");
        if (currentEnd - currentStart > maxEnd - maxStart) {
          maxStart = currentStart;
          maxEnd = currentEnd;
        }
        currentStart = 0;
        currentEnd = 0;
      }
    }

    if (currentEnd - currentStart > maxEnd - maxStart) {
      maxStart = currentStart;
      maxEnd = currentEnd;
    }
    let last = maxEnd == octets.length - 1;
    if (maxStart !== 0 && maxEnd !== 0) {
      octets.splice(maxStart, maxEnd - maxStart + 1, "");
    }
    return octets.join(":") + (last ? ":" : "");
  }

  /**
   * This function generates a maximized version of the IP-address.
   * IPv4: It will do nothing.
   * IPv6: It will add leading zeros to each octet. Also it will add missing octets.
   * @returns {string} The maximized IP-address.
   */
  maximize() {
    if (this.type == 4) {
      return this.ip;
    }
    let octets = this.ip.split(":");
    let missing = octets.indexOf("");
    if (missing !== -1) {
      octets.splice(missing, 1, ...Array(9 - octets.length).fill("0"));
    }
    for (let i = 0; i < octets.length; i++) {
      octets[i] = octets[i].padStart(4, "0");
    }
    return octets.join(":");
  }

  /**
   * This function converts the IP-address to a number.
   * @returns {bigint} The IP-address as a number.
   */
  asNumber() {
    return this.octets.reduce((acc, octet, index) => {
      return (
        BigInt(acc) +
        BigInt(
          octet *
            Math.pow(
              this.type == 4 ? CONSTANTS.IPV4_POW : CONSTANTS.IPV6_POW,
              (this.type == 4 ? CONSTANTS.IPV4_OCTETS : CONSTANTS.IPV6_OCTETS) -
                1 -
                index,
            ),
        )
      );
    }, 0);
  }

  /**
   * This function converts a number to an IP address.
   * @param {bigint} number The number to convert.
   * @param {number} type The type of the IP address. 4 for IPv4 and 6 for IPv6.
   * @returns {IPAddress} The IP address.
   */
  static fromNumber(number, type) {
    if (typeof number !== "bigint") {
      throw new InvalidConversionError("Invalid number");
    }
    if (type == 4) {
      let octets = [];
      for (let i = 0; i < CONSTANTS.IPV4_OCTETS; i++) {
        octets.push(
          (number >> BigInt(8 * (CONSTANTS.IPV4_OCTETS - 1 - i))) %
            BigInt(CONSTANTS.IPV4_POW),
        );
      }
      return new this(octets.join("."), 32);
    }
    if (type == 6) {
      let octets = [];
      for (let i = 0; i < CONSTANTS.IPV6_OCTETS; i++) {
        octets.push(
          (number >> BigInt(16 * (CONSTANTS.IPV6_OCTETS - 1 - i))) %
            BigInt(CONSTANTS.IPV6_POW),
        );
      }
      return new this(octets.map((octet) => octet.toString(16)).join(":"), 128);
    }
    throw new InvalidConversionError("Invalid type");
  }

  /**
   * This function converts the network mask to a number.
   * @returns {bigint} The network mask as a number.
   */
  maskAsNumber() {
    let bits =
      this.type == 4
        ? CONSTANTS.IPV4_BITS_PER_GROUP
        : CONSTANTS.IPV6_BITS_PER_GROUP;
    let octets = this.type == 4 ? CONSTANTS.IPV4_OCTETS : CONSTANTS.IPV6_OCTETS;
    return (
      BigInt(Math.pow(2, octets * bits)) -
      BigInt(Math.pow(2, octets * bits - this.net))
    );
  }

  /**
   * This function applies the network mask to the IP-address.
   * This will do nothing to the current instance.
   * @returns {IPAddress} The masked IP-address.
   */
  applyMask() {
    return IPAddress.fromNumber(
      this.asNumber() & this.maskAsNumber(),
      this.type,
    );
  }

  /**
   *
   * @param by
   */
  increment(by) {
    return IPAddress.fromNumber(this.asNumber() + BigInt(by), this.type);
  }

  /**
   *
   * @param by
   */
  decrement(by) {
    return IPAddress.fromNumber(this.asNumber() - BigInt(by), this.type);
  }

  /**
   * This function returns the subnet of the IP-address.
   * @returns {IPSubnet} The subnet of the IP-address.
   */
  getSubnet() {
    return new IPSubnet(this);
  }
}

module.exports = IPAddress;
