const testsContext = (<any>require).context('.', true, /\.test\.js$/)
testsContext.keys().forEach(testsContext)
