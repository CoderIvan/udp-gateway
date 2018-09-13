const events = require('events')
const Server = require('./server')
const Connect = require('./connect')
const Context = require('./context')

module.exports = class Gateway extends events.EventEmitter {
	constructor() {
		super()
		this.server = new Server()
		this.connect = new Connect()
	}

	listen(port, host) {
		this.server.on('message', ({ buffer, reply }) => {
			process.nextTick(() => {
				this.connect.execute(new Context(buffer, reply)).catch(this.emit.bind(this, 'error'))
			})
		})
		this.server.on('error', this.emit.bind(this, 'error'))
		return this.server.listen(port, host)
	}

	close() {
		return this.server.close()
	}
}
