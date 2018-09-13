const Bluebird = require('bluebird')
const dgram = require('dgram')
const events = require('events')
const os = require('os')

Bluebird.promisifyAll(dgram)

module.exports = class Server extends events.EventEmitter {
	constructor() {
		super()
		this.server = dgram.createSocket('udp4')
		this.server.on('error', this.emit.bind(this, 'error'))
		this.server.on('message', (msg, { port, address }) => {
			this.emit('message', {
				buffer: msg,
				reply: buffer => this.server.sendAsync(buffer, port, address),
			})
		})
	}

	listen(port) {
		return this.server.bindAsync({
			port,
			exclusive: os.platform() === 'win32',
		}).then(() => {
			this.server.setRecvBufferSize((2 ** 31) - 1)
			this.server.setSendBufferSize((2 ** 31) - 1)
		})
	}

	close() {
		return this.server.closeAsync()
	}
}
