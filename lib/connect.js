module.exports = class Connect {
	constructor() {
		this.layers = []
	}

	add(layer) {
		this.layers.push(layer)
	}

	execute(context) {
		let index = 0
		const next = () => {
			if (index < this.layers.length) {
				const layer = this.layers[index]
				index += 1
				try {
					return Promise.resolve(layer(context, next))
				} catch (err) {
					return Promise.reject(err)
				}
			}
			return Promise.resolve()
		}
		return next()
	}
}
