/**
 *
 */
class InvalidIPError extends Error {
  /**
   *
   * @param ip
   * @param net
   */
  constructor(ip, net) {
    super(`Invalid IP address: ${ip}/${net}`);
  }
}

/**
 *
 */
class InvalidConversionError extends Error {}

module.exports = {
  InvalidIPError,
  InvalidConversionError,
};
