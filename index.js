import dns from 'dns';
import readline from 'readline';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { promisify } = require('util');

const resolve4Async = promisify(dns.resolve4);
const resolve6Async = promisify(dns.resolve6);
const resolveCnameAsync = promisify(dns.resolveCname);
const resolveMxAsync = promisify(dns.resolveMx);
const resolveTxtAsync = promisify(dns.resolveTxt);
const resolveNsAsync = promisify(dns.resolveNs);
const resolveSoaAsync = promisify(dns.resolveSoa);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questionAsync = promisify(rl.question).bind(rl);

const lookupDNS = async (url) => {
  try {
    const addressesV4 = await resolve4Async(url);
    console.log('A (IPv4) records:', addressesV4);
  } catch (err) {
    console.log('A (IPv4) record not found');
  }

  try {
    const addressesV6 = await resolve6Async(url);
    console.log('AAAA (IPv6) records:', addressesV6);
  } catch (err) {
    console.log('AAAA (IPv6) record not found');
  }

  try {
    const cnames = await resolveCnameAsync(url);
    console.log('CNAME records:', cnames);
  } catch (err) {
    console.log('CNAME record not found');
  }

  try {
    const mxRecords = await resolveMxAsync(url);
    console.log('MX records:', mxRecords);
  } catch (err) {
    console.log('MX record not found',);
  }

  try {
    const txtRecords = await resolveTxtAsync(url);
    console.log('TXT records:', txtRecords);
  } catch (err) {
    console.log('TXT record not found');
  }

  try {
    const nsRecords = await resolveNsAsync(url);
    console.log('NS records:', nsRecords);
  } catch (err) {
    console.log('NS record not found');
  }

  try {
    const soaRecord = await resolveSoaAsync(url);
    console.log('SOA record:', soaRecord);
  } catch (err) {
    console.log('SOA record not found');
  }

  const nextUrl = await questionAsync('Enter another URL to lookup or press Ctrl+C to exit: ');
  if (nextUrl) lookupDNS(nextUrl);
};

const main = async () => {
  console.log('Welcome to the DNS Lookup Tool \n');
  const url = await questionAsync('Enter a URL to lookup DNS records: ');
  if (url) lookupDNS(url);
};

main();

rl.on('close', () => {
  console.log('DNS lookup tool has been closed.');
});
