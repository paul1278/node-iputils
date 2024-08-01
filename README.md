# node-iputils
A quite small and simple IP-library with only a few classes. Tested & linted.

**Features:**
* Handle IPv4 & IPv6 addresses and subnets with the same class.
* Simply pass addresses into constructors, the library will decide what it is and how to handle it.
* Calculate the first and last IP of a subnet.
* Apply a mask to an IP address.
* Find out if an IP is inside a subnet.
* Increment or decrement IPs to get e.g. the next one.
* Convert addresses to numbers and back.

## Usage
Install using `npm`:
```bash
npm install node-iputils
```

Now use it in your code:
```js
const { IPAddress } = require("node-iputils");

const ipSubnet = new IPAddress("192.168.0.0", 24);
const ipv4 = new IPAddress("192.168.0.5", 32);
ipSubnet.getSubnet().isInSubnet(ipv4) // => true

const ipv6Subnet = new IPAddress("fde8:894a:40c:ee20::", 64);
const ipv6 = new IPAddress("fde8:894a:40c:ee20:0::05:5", 128);
ipv6Subnet.getSubnet().isInSubnet(ipv6) // => true

/* The following functions also work for IPv4-addresses */
ipv6.maximize() // => fde8:894a:040c:ee20:0000:0000:0005:0005
ipv6.minimize() // => fde8:894a:040c:ee20::5:5
ipv6.asNumber() // => 337502080359017093851530813254247186437n

const ipv6FromNumber = IPAddress.fromNumber(337502080359017093851530813254247186437n, 6); // => new IPAddress instance.

ipv4.maskAsNumber() // => 4294967295n
```

# API documentation
## Classes

<dl>
<dt><a href="#InvalidIPError">InvalidIPError</a></dt>
<dd><p>This is the default error, which will be thrown by the library.</p></dd>
<dt><a href="#InvalidConversionError">InvalidConversionError</a></dt>
<dd><p>This error will be thrown when some kind of conversion goes wrong.
Like passing an IPv4 address to an IPv6 function etc.</p></dd>
<dt><a href="#IPAddress">IPAddress</a></dt>
<dd><p>This class is responsible for storing an IP-address.
It automatically resolves the type and you can use the same class for IPv4 and IPv6 addresses.</p></dd>
<dt><a href="#IPSubnet">IPSubnet</a></dt>
<dd><p>This class is responsible for storing an IP-address.
It automatically resolves the type and you can use the same class for IPv4 and IPv6 addresses.</p></dd>
</dl>

<a name="InvalidIPError"></a>

## InvalidIPError
<p>This is the default error, which will be thrown by the library.</p>

**Kind**: global class  
<a name="new_InvalidIPError_new"></a>

### new InvalidIPError(ip, net)
<p>This is the constructor of the InvalidIPError class.</p>


| Param | Type | Description |
| --- | --- | --- |
| ip | <code>string</code> | <p>The IP address which is invalid.</p> |
| net | <code>string</code> | <p>The network mask which is invalid.</p> |

<a name="InvalidConversionError"></a>

## InvalidConversionError
<p>This error will be thrown when some kind of conversion goes wrong.
Like passing an IPv4 address to an IPv6 function etc.</p>

**Kind**: global class  
<a name="IPAddress"></a>

## IPAddress
<p>This class is responsible for storing an IP-address.
It automatically resolves the type and you can use the same class for IPv4 and IPv6 addresses.</p>

**Kind**: global class  

* [IPAddress](#IPAddress)
    * [new IPAddress(ip, net)](#new_IPAddress_new)
    * _instance_
        * [.minimize()](#IPAddress+minimize) ⇒ <code>string</code>
        * [.maximize()](#IPAddress+maximize) ⇒ <code>string</code>
        * [.asNumber()](#IPAddress+asNumber) ⇒ <code>bigint</code>
        * [.maskAsNumber()](#IPAddress+maskAsNumber) ⇒ <code>bigint</code>
        * [.applyMask()](#IPAddress+applyMask) ⇒ [<code>IPAddress</code>](#IPAddress)
        * [.increment(by)](#IPAddress+increment) ⇒ [<code>IPAddress</code>](#IPAddress)
        * [.decrement(by)](#IPAddress+decrement) ⇒ [<code>IPAddress</code>](#IPAddress)
        * [.getSubnet()](#IPAddress+getSubnet) ⇒ [<code>IPSubnet</code>](#IPSubnet)
    * _static_
        * [.fromNumber(number, type)](#IPAddress.fromNumber) ⇒ [<code>IPAddress</code>](#IPAddress)

<a name="new_IPAddress_new"></a>

### new IPAddress(ip, net)
<p>The constructor validates the given address and stores it maximized.</p>


| Param | Type | Description |
| --- | --- | --- |
| ip | <code>string</code> | <p>The IP-address to store.</p> |
| net | <code>string</code> | <p>The network mask to store.</p> |

<a name="IPAddress+minimize"></a>

### ipAddress.minimize() ⇒ <code>string</code>
<p>This function generates a minimized version of the IP-address.
IPv4: It will remove nothing.
IPv6: It will remove leading zeros and replace a group of of zeros with &quot;::&quot;.</p>

**Kind**: instance method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: <code>string</code> - <p>The minimized IP-address.</p>  
<a name="IPAddress+maximize"></a>

### ipAddress.maximize() ⇒ <code>string</code>
<p>This function generates a maximized version of the IP-address.
IPv4: It will do nothing.
IPv6: It will add leading zeros to each octet. Also it will add missing octets.</p>

**Kind**: instance method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: <code>string</code> - <p>The maximized IP-address.</p>  
<a name="IPAddress+asNumber"></a>

### ipAddress.asNumber() ⇒ <code>bigint</code>
<p>This function converts the IP-address to a number.</p>

**Kind**: instance method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: <code>bigint</code> - <p>The IP-address as a number.</p>  
<a name="IPAddress+maskAsNumber"></a>

### ipAddress.maskAsNumber() ⇒ <code>bigint</code>
<p>This function converts the network mask to a number.</p>

**Kind**: instance method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: <code>bigint</code> - <p>The network mask as a number.</p>  
<a name="IPAddress+applyMask"></a>

### ipAddress.applyMask() ⇒ [<code>IPAddress</code>](#IPAddress)
<p>This function applies the network mask to the IP-address.
This will do nothing to the current instance.</p>

**Kind**: instance method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: [<code>IPAddress</code>](#IPAddress) - <p>The masked IP-address.</p>  
<a name="IPAddress+increment"></a>

### ipAddress.increment(by) ⇒ [<code>IPAddress</code>](#IPAddress)
<p>Increment the currently stored IP address by the given number and return a new IPAddress instance.
Won't modify the current instance.</p>

**Kind**: instance method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: [<code>IPAddress</code>](#IPAddress) - <p>The incremented IP address.</p>  

| Param | Type | Description |
| --- | --- | --- |
| by | <code>number</code> | <p>The number to increment the IP address by.</p> |

<a name="IPAddress+decrement"></a>

### ipAddress.decrement(by) ⇒ [<code>IPAddress</code>](#IPAddress)
<p>Decrement the currently stored IP address by the given number and return a new IPAddress instance.
Won't modify the current instance.</p>

**Kind**: instance method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: [<code>IPAddress</code>](#IPAddress) - <p>The decremented IP address.</p>  

| Param | Type | Description |
| --- | --- | --- |
| by | <code>number</code> | <p>The number to decrement the IP address by.</p> |

<a name="IPAddress+getSubnet"></a>

### ipAddress.getSubnet() ⇒ [<code>IPSubnet</code>](#IPSubnet)
<p>This function returns the subnet of the IP-address.</p>

**Kind**: instance method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: [<code>IPSubnet</code>](#IPSubnet) - <p>The subnet of the IP-address.</p>  
<a name="IPAddress.fromNumber"></a>

### IPAddress.fromNumber(number, type) ⇒ [<code>IPAddress</code>](#IPAddress)
<p>This function converts a number to an IP address.</p>

**Kind**: static method of [<code>IPAddress</code>](#IPAddress)  
**Returns**: [<code>IPAddress</code>](#IPAddress) - <p>The IP address.</p>  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>bigint</code> | <p>The number to convert.</p> |
| type | <code>number</code> | <p>The type of the IP address. 4 for IPv4 and 6 for IPv6.</p> |

<a name="IPSubnet"></a>

## IPSubnet
<p>This class is responsible for storing an IP-address.
It automatically resolves the type and you can use the same class for IPv4 and IPv6 addresses.</p>

**Kind**: global class  

* [IPSubnet](#IPSubnet)
    * [new IPSubnet(parent)](#new_IPSubnet_new)
    * [.isMatchingType(address)](#IPSubnet+isMatchingType)
    * [.isInSubnet(address)](#IPSubnet+isInSubnet) ⇒ <code>boolean</code>
    * [.getBiggestIPAsNumber()](#IPSubnet+getBiggestIPAsNumber) ⇒ <code>bigint</code>
    * [.getSmallestIPAsNumber()](#IPSubnet+getSmallestIPAsNumber) ⇒ <code>bigint</code>

<a name="new_IPSubnet_new"></a>

### new IPSubnet(parent)
<p>The constructor validates the given address and stores it maximized.</p>


| Param | Type | Description |
| --- | --- | --- |
| parent | [<code>IPAddress</code>](#IPAddress) | <p>The parent IP address from which this subnet is generated.</p> |

<a name="IPSubnet+isMatchingType"></a>

### ipSubnet.isMatchingType(address)
<p>This function checks if the given address is of the same type as the parent.</p>

**Kind**: instance method of [<code>IPSubnet</code>](#IPSubnet)  
**Throws**:

- [<code>InvalidIPError</code>](#InvalidIPError) <p>If the address is of a different type.</p>


| Param | Type | Description |
| --- | --- | --- |
| address | [<code>IPAddress</code>](#IPAddress) | <p>The address to check.</p> |

<a name="IPSubnet+isInSubnet"></a>

### ipSubnet.isInSubnet(address) ⇒ <code>boolean</code>
<p>This function checks if the given address is in the subnet.</p>

**Kind**: instance method of [<code>IPSubnet</code>](#IPSubnet)  
**Returns**: <code>boolean</code> - <p>True if the address is in the subnet, false otherwise.</p>  

| Param | Type | Description |
| --- | --- | --- |
| address | [<code>IPAddress</code>](#IPAddress) | <p>The address to check.</p> |

<a name="IPSubnet+getBiggestIPAsNumber"></a>

### ipSubnet.getBiggestIPAsNumber() ⇒ <code>bigint</code>
<p>This function returns the biggest IP address in the subnet as a number.</p>

**Kind**: instance method of [<code>IPSubnet</code>](#IPSubnet)  
**Returns**: <code>bigint</code> - <p>The biggest IP address in the subnet as a number.</p>  
<a name="IPSubnet+getSmallestIPAsNumber"></a>

### ipSubnet.getSmallestIPAsNumber() ⇒ <code>bigint</code>
<p>This function returns the smallest IP address in the subnet as a number.</p>

**Kind**: instance method of [<code>IPSubnet</code>](#IPSubnet)  
**Returns**: <code>bigint</code> - <p>The smallest IP address in the subnet as a number.</p>  

---
&copy; /dev/paul