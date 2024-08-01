/**
 * This is the default error, which will be thrown by the library.
 */
class InvalidIPError extends Error {
  /**
   * This is the constructor of the InvalidIPError class.
   * @param {string} ip - The IP address which is invalid.
   * @param {string} net - The network mask which is invalid.
   */
  constructor(ip, net) {
    super(`Invalid IP address: ${ip}/${net}`);
  }
}

/**
 * This error will be thrown when some kind of conversion goes wrong.
 * Like passing an IPv4 address to an IPv6 function etc.
 */
class InvalidConversionError extends Error {}

module.exports = {
  InvalidIPError,
  InvalidConversionError,
};
