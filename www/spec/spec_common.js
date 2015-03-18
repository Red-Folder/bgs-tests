function spec_start() {
	it("should start", function() {
		
		/*
		 * Defines code to be run, in this case startService
		 * Notice the call back functions set the flag to true
		 */
		runs(function() {
			flag = false;
			returnedData = null;
			
			myService.startService(	function(data) {
										returnedData = data;
										flag = true;
									},
									function(data) {
										returnedData = data;
										flag = true;
									});
		});
		
		/*
		 * Waits for the flag to be set to true (will timeout after 60 seconds).
		 * All Plugin callbacks are asynchronous.  Jasmine provides this run/ wait functionality to test
		 * In this case we wait for one of the callback to set flag to true, which will release the wait
		 * or the 60 second timeout occurs (at which point the "it" test would fail)
		 */
		waitsFor(function() { return flag; }, "Flag should be set", 60 * 1000);
		
		/*
		 * Now tests that we have ServiceRunning == true
		 * If any of the expect statements return false the test fails
		 */
		runs(function() {
			expect(returnedData).toBeDefined();
			expect(returnedData).not.toBeNull();
			expect(returnedData.ServiceRunning).toBeDefined();
			expect(returnedData.ServiceRunning).toBe(true);
		});
	});
}

function spec_stop() {
	it("should stop service", function() {

		/*
		 * Defines code to be run, in this case stopService
		 * Notice the call back functions set the flag to true
		 */
		runs(function() {
			flag = false;
			returnedData = null;
			
			myService.stopService(	function(data) {
										returnedData = data;
										flag = true;
									},
									function(data) {
										returnedData = data;
										flag = true;
									});
		});
		
		/*
		 * Waits for the flag to be set to true (will timeout after 60 seconds).
		 * All Plugin callbacks are asynchronous.  Jasmine provides this run/ wait functionality to test
		 * In this case we wait for one of the callback to set flag to true, which will release the wait
		 * or the 60 second timeout occurs (at which point the "it" test would fail)
		 */
		waitsFor(function() { return flag; }, "Flag should be set", 60 * 1000);
		
		/*
		 * Now tests that we have ServiceRunning == false
		 * If any of the expect statements return false the test fails
		 */
		runs(function() {
			expect(returnedData).toBeDefined();
			expect(returnedData).not.toBeNull();
			expect(returnedData.ServiceRunning).toBeDefined();
			expect(returnedData.ServiceRunning).toBe(false);
		});
	});

}

function spec_enable() {
	it("should be able to enable timer", function() {
		/*
		 * Defines code to be run, in this case EnableTimer
		 * Timer is being set to run every 30 seconds
		 * Note that below I test every 60 - just to be extra confident that a timer
		 * loop will occur between each test
		 * Notice the call back functions set the flag to true
		 */
		runs(function() {
			flag = false;
			returnedData = null;
			
			// Set to run every 30 seconds
			myService.enableTimer(	30 * 1000,
									function(data) {
										returnedData = data;
										flag = true;
									},
									function(data) {
										returnedData = data;
										flag = true;
									});
		});
		
		/*
		 * Waits for the flag to be set to true (will timeout after 60 seconds).
		 * All Plugin callbacks are asynchronous.  Jasmine provides this run/ wait functionality to test
		 * In this case we wait for one of the callback to set flag to true, which will release the wait
		 * or the 60 second timeout occurs (at which point the "it" test would fail)
		 */
		waitsFor(function() { return flag; }, "Flag should be set", 60 * 1000);
		
		/*
		 * Now tests that we have TimerEnabled == true
		 * If any of the expect statements return false the test fails
		 * We can also test that the Milliseconds have been set correctly
		 */
		runs(function() {
			expect(returnedData).toBeDefined();
			expect(returnedData).not.toBeNull();
		
			expect(returnedData.TimerEnabled).toBeDefined();
			expect(returnedData.TimerEnabled).toBe(true);

			// Should be 30 seconds			
			expect(returnedData.TimerMilliseconds).toBeDefined();
			expect(returnedData.TimerMilliseconds).toEqual(30 * 1000);
		});
	});
}

function spec_disable() {
	it("should disable timer", function() {

		/*
		 * Defines code to be run, in this case disableTimer
		 * Notice the call back functions set the flag to true
		 */
		runs(function() {
			flag = false;
			returnedData = null;
			
			myService.disableTimer(	function(data) {
										returnedData = data;
										flag = true;
									},
									function(data) {
										returnedData = data;
										flag = true;
									});
		});
		
		/*
		 * Waits for the flag to be set to true (will timeout after 60 seconds).
		 * All Plugin callbacks are asynchronous.  Jasmine provides this run/ wait functionality to test
		 * In this case we wait for one of the callback to set flag to true, which will release the wait
		 * or the 60 second timeout occurs (at which point the "it" test would fail)
		 */
		waitsFor(function() { return flag; }, "Flag should be set", 60 * 1000);
		
		/*
		 * Now tests that we have TimerEnabled == false
		 * If any of the expect statements return false the test fails
		 */
		runs(function() {
			expect(returnedData).toBeDefined();
			expect(returnedData).not.toBeNull();
			expect(returnedData.TimerEnabled).toBeDefined();
			expect(returnedData.TimerEnabled).toBe(false);
		});
	});
}	

function spec_wait(milliseconds) {
	runs(function() {
		flag = false;
					
		setTimeout(function() {
			flag = true;
			}, milliseconds);
	});
	
	//  Time out if the above doesn't occur on time
	waitsFor(function() {return flag;}, "Flag should be set", milliseconds + 5000);
}