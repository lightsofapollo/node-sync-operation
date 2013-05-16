.PHONY: test
test:
	./node_modules/mocha/bin/mocha --ui tdd test/index-test.js
