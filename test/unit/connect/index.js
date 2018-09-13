const { expect } = require('chai')

const Connect = require('../../../lib/connect')

describe('Connect', () => {
	it('API: add', () => {
		const connect = new Connect()

		const functionArray = Array.from({ length: 10 }, async () => {})

		functionArray.forEach(connect.add.bind(connect))

		expect(connect.layers).to.eql(functionArray)
	})

	it('API: execute -- Async', async () => {
		const content = 'Hello World'
		const connect = new Connect()
		let result = ''
		content.split('').forEach((char) => {
			connect.add(async (ctx, next) => {
				result += char
				await next()
			})
		})

		await connect.execute({})

		expect(result).to.eql(content)
	})

	it('API: execute -- return Promise', async () => {
		const content = 'Hello World'
		const connect = new Connect()
		let result = ''
		content.split('').forEach((char) => {
			connect.add((ctx, next) => {
				result += char
				return next()
			})
		})

		await connect.execute({})

		expect(result).to.eql(content)
	})


	it('API: execute -- seria', async () => {
		const content = 'Hello World'
		const connect = new Connect()
		let result = ''
		content.split('').forEach((char) => {
			connect.add(async (ctx, next) => {
				await new Promise(resolve => setTimeout(() => {
					result += char
					resolve()
				}, Math.random() * 10))
				await next()
			})
		})

		await connect.execute({})

		expect(result).to.eql(content)
	})
})
