clean:
	rm -rf target

run:
	clj -M:dev

repl:
	clj -M:dev:nrepl

test:
	clj -M:test

uberjar:
	clj -T:build all

run-uberjar:
	clj -T:build all && java -jar target/clj-shopping-standalone.jar