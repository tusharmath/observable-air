const testsContext = (<any>require).context('.', true, /.*\.js$/)
testsContext.keys().forEach(testsContext)
