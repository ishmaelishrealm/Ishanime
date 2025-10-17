// DNS Propagation Test Script
// Run with: node test-dns-propagation.js

const dns = require('dns');
const { promisify } = require('util');

const resolveCname = promisify(dns.resolveCname);

async function testDNSPropagation() {
    console.log('🌐 Testing DNS Propagation for api.ishanime.com...\n');
    
    try {
        // Test CNAME resolution
        const cnameRecords = await resolveCname('api.ishanime.com');
        console.log('✅ CNAME Records found:');
        cnameRecords.forEach(record => {
            console.log(`   → ${record}`);
        });
        
        // Check if it points to Bunny
        const pointsToBunny = cnameRecords.some(record => 
            record.includes('bunny.run') || record.includes('b-cdn.net')
        );
        
        if (pointsToBunny) {
            console.log('\n🎉 SUCCESS: api.ishanime.com points to Bunny CDN!');
            console.log('✅ DNS propagation is complete');
            console.log('✅ Ready to configure SSL in Bunny dashboard');
        } else {
            console.log('\n⚠️  WARNING: CNAME does not point to Bunny CDN');
            console.log('   Expected: *.bunny.run or *.b-cdn.net');
            console.log('   Check your Namecheap DNS settings');
        }
        
    } catch (error) {
        if (error.code === 'ENOTFOUND') {
            console.log('❌ DNS not found yet - still propagating');
            console.log('⏳ Wait 5-30 minutes and try again');
        } else if (error.code === 'ENODATA') {
            console.log('❌ No CNAME record found');
            console.log('🔧 Check your Namecheap DNS settings:');
            console.log('   Type: CNAME');
            console.log('   Host: api');
            console.log('   Value: ishanime-api-pzssf.bunny.run');
        } else {
            console.log('❌ DNS Error:', error.message);
        }
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. If DNS is working: Add hostname in Bunny dashboard');
    console.log('2. Enable SSL in Bunny');
    console.log('3. Update frontend API_URL to https://api.ishanime.com');
    console.log('4. Test: https://api.ishanime.com/api/health');
}

// Run the test
testDNSPropagation();
