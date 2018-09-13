const Bluebird = require('bluebird')
const dgram = require('dgram')
const { expect } = require('chai')

const Server = require('../../../lib/server')

Bluebird.promisifyAll(dgram)

describe('Server', () => {
	it('Base', async () => {
		const server = new Server()
		const client = dgram.createSocket('udp4')
		const port = 8080
		const request_content = Buffer.from('Hello')
		const resposne_content = Buffer.from('World')

		const request_content_result = new Promise((resolve) => {
			server.once('message', ({ buffer, reply }) => {
				resolve(buffer)
				reply(resposne_content)
			})
		})
		const response_content_result = new Promise((resolve) => {
			client.once('message', (buffer) => {
				resolve(buffer)
			})
		})

		await server.listen(port)
		await client.sendAsync(request_content, port, 'localhost')
		const results = await Promise.all([request_content_result, response_content_result])

		expect(results[0]).to.eql(request_content)
		expect(results[1]).to.eql(resposne_content)
		await Promise.all([server.close(), client.closeAsync()])
	})
})
