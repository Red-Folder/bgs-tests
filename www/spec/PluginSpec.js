/*
 * Suite of tests to start the Background Service
 * Jasmine "describe" section
 */
 
describe("When Plugin not running", function() {

	/*
	 * Test to prove that calling startService will return ServiceRunning flag as true
	 * (thus indicating that it the service has started) 
	 * Jasmine "it" section
	 */
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
});

describe("When Service has started", function() {
	
	it("it should have different latest result every time runOnce is called", function() {
		var previousResult = '';

		// Run First time
		runs(function() {
			flag = false;
			success = false;
			returnedData = null;
			
			myService.runOnce(	function(data) {
									success = true;
									returnedData = data;
									flag = true;
								},
								function(data) {
									returnedData = data;
									flag = true;
								});
		});

		waitsFor(function() {return flag;}, "Flag should be set", 2 * 60 * 1000);

		runs(function() {
			expect(success).toBe(true);

			expect(returnedData).toBeDefined();
			expect(returnedData).not.toBeNull();
			expect(returnedData.LatestResult).toBeDefined();
			expect(returnedData.LatestResult).not.toBeNull();
			expect(returnedData.LatestResult.Message).toBeDefined();
			expect(returnedData.LatestResult.Message).not.toBeNull();
			expect(returnedData.LatestResult.Message).toMatch('^Hello');
				
			previousResult = returnedData.LatestResult.Message;
		}); 

		// Now wait 30 seconds
		runs(function() {
			flag = false;
					
			setTimeout(function() {
				flag = true;
			}, 30 * 1000);
		});
		waitsFor(function() {return flag;}, "Flag should be set", 2 * 60 * 1000);

		// Run Second time
		runs(function() {
			flag = false;
			success = false;
			returnedData = null;
			
			myService.runOnce(	function(data) {
									success = true;
									returnedData = data;
									flag = true;
								},
								function(data) {
									returnedData = data;
									flag = true;
								});
		});

		waitsFor(function() {return flag;}, "Flag should be set", 2 * 60 * 1000);

		runs(function() {
			expect(success).toBe(true);

			expect(returnedData).toBeDefined();
			expect(returnedData).not.toBeNull();
			expect(returnedData.LatestResult).toBeDefined();
			expect(returnedData.LatestResult).not.toBeNull();
			expect(returnedData.LatestResult.Message).toBeDefined();
			expect(returnedData.LatestResult.Message).not.toBeNull();
			expect(returnedData.LatestResult.Message).toMatch('^Hello');

			expect(returnedData.LatestResult.Message).not.toEqual(previousResult);
		}); 

	});
	
	
	/*
	 * Test to prove that calling enableTimer will return TimerEnabled flag as true
	 * (thus indicating that it the timer has been enabled) 
	 * Jasmine "it" section
	 */
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
	
	
});

/*
 * Suite of tests to validate that the BackgroundService is actually running
 * And that it can be stopped
 * Jasmine "describe" section
 */
describe("When Plugin is running", function() {
	
	/*
	 * Test to prove that the running BackgroundService is producing a different result ever minutes
	 * My BackgroundService in the sample is producing an "Hello" message with a date and time
	 * I do a simple check to make sure that the message is different between each call to getStatus
	 * thus indicating that the date and time are being changed by the Background Service
	 * Jasmine "it" section
	 */
	it("it should have different latest result every minute", function() {
		var previousResult = '';
	
		/*
		 * This test loops round 2 times and checks that the Message is different each time
		 */
		for (var i = 0; i < 2; i++ ) {
	
			/*
			 * This, with the below wait, is causing Jasmine to 60 seconds 
			 * This is to allow time for the Background Service to be fired 
			 * and thus produce a different result
			 */
			runs(function() {
				flag = false;
					
				setTimeout(function() {
					flag = true;
				}, 60 * 1000);
			});
				
			/*
			 * Will wait for the above 60 second timeout function
			 */ 
			waitsFor(function() {return flag;}, "Flag should be set", 2 * 60 * 1000);
	
	   		/*
	   		 * Runs the getStatus
			 * Notice the call back functions set the flag to true
	   		 */
			runs(function() {
				flag = false;
				success = false;
				latestResult = "";
				
				myService.getStatus(function(data) {
										success = true;
										latestResult = data.LatestResult.Message;
										flag = true;
									},
									function(data) {
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
			 * Tests that the returned message includes "Hello" and is different
			 * from the last run
			 */		
			runs(function() {
				expect(success).toBe(true);
				expect(latestResult).toMatch('^Hello');
				expect(latestResult).not.toEqual(previousResult);
				
				previousResult = latestResult;
			}); 
		
		};
	});
	
	/*
	 * Test to prove that calling disableTimer will return TimerEnabled flag as false
	 * (thus indicating that it the timer has been disabled) 
	 * Jasmine "it" section
	 */
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

	/*
	 * Test to prove that calling stopService will return ServiceRunning flag as false
	 * (thus indicating that it the service has stopped) 
	 * Jasmine "it" section
	 */
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
	
	
});
