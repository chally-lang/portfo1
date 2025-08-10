// Simple test script to verify contact and newsletter functionality
const testContactForm = async () => {
  console.log('🧪 Testing Contact Form...');
  
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message to verify the contact form is working properly.'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Contact form test PASSED:', data.message);
      return true;
    } else {
      console.log('❌ Contact form test FAILED:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Contact form test ERROR:', error.message);
    return false;
  }
};

const testNewsletterSubscription = async () => {
  console.log('🧪 Testing Newsletter Subscription...');
  
  try {
    const response = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'newsletter-test@example.com'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Newsletter subscription test PASSED:', data.message || 'Subscribed successfully');
      return true;
    } else {
      console.log('❌ Newsletter subscription test FAILED:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Newsletter subscription test ERROR:', error.message);
    return false;
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting Contact & Newsletter Tests...\n');
  
  const contactResult = await testContactForm();
  console.log('');
  const newsletterResult = await testNewsletterSubscription();
  
  console.log('\n📊 Test Results:');
  console.log(`Contact Form: ${contactResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Newsletter: ${newsletterResult ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (contactResult && newsletterResult) {
    console.log('\n🎉 All tests passed! Your contact form and newsletter are working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the error messages above.');
  }
};

// Export for use as a module or run directly
if (typeof window === 'undefined') {
  runTests();
}

module.exports = { testContactForm, testNewsletterSubscription, runTests };