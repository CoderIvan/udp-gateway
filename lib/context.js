module.exports = class Context {
	constructor(buffer, reply) {
		this.req = {
			buffer,
		}
		this.res = {
			buffer: null,
		}
		this.reply = reply
	}

	end() {
		if (this.res.buffer && this.res.buffer.length) {
			return this.reply(this.res.buffer)
		}
		return Promise.resolve()
	}
}
