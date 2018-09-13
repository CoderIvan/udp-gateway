/* global set bench */
const Connect = require('../../../lib/connect')

suite('compose', () => {
	set('type', 'adaptive')
	set('mintime', 1000)
	set('delay', 100)

	for (let exp = 0; exp <= 10; exp += 1) {
		const connect = new Connect()
		const count = 2 ** exp
		for (let i = 0; i < count; i += 1) {
			connect.add((ctx, next) => next())
		}

		bench(`(fn * ${count})`, (done) => {
			connect.execute({}).then(done).catch(done)
		})
	}
})
