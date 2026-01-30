import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCIDR, parseTarget } from '../src/scanner.js';

test('parseCIDR correctly parses /24 range', () => {
    const ips = parseCIDR('192.168.1.0/24');
    assert.strictEqual(ips.length, 254);
    assert.strictEqual(ips[0], '192.168.1.1');
    assert.strictEqual(ips[253], '192.168.1.254');
});

test('parseCIDR throws error for ranges larger than /24', () => {
    assert.throws(() => parseCIDR('192.168.1.0/23'), /CIDR prefix must be \/24 or larger/);
});

test('parseTarget resolves localhost', async () => {
    const hosts = await parseTarget('localhost');
    assert.ok(hosts.includes('localhost'));
    assert.ok(hosts.includes('127.0.0.1'));
    assert.ok(hosts.includes('::1'));
});

test('parseTarget resolves single IP', async () => {
    const hosts = await parseTarget('10.0.0.1');
    assert.deepStrictEqual(hosts, ['10.0.0.1']);
});
