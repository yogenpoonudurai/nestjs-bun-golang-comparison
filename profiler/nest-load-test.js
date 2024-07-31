import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

// Custom metrics
const errorCounter = new Counter('errors');

export let options = {
    scenarios: {
        warm_up: {
            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '30s', target: 10 }
            ],
        },
        load_test: {
            executor: 'ramping-arrival-rate',
            startRate: 10,
            timeUnit: '1s',
            preAllocatedVUs: 50,
            maxVUs: 100,
            stages: [
                { duration: '1m', target: 50 },
                { duration: '2m', target: 50 },
                { duration: '1m', target: 100 },
                { duration: '2m', target: 100 },
            ],
        },
        stress_test: {
            executor: 'ramping-arrival-rate',
            startRate: 50,
            timeUnit: '1s',
            preAllocatedVUs: 50,
            maxVUs: 200,
            stages: [
                { duration: '2m', target: 200 },
                { duration: '2m', target: 200 },
                { duration: '2m', target: 50 },
            ],
        },
        // capacity_finding: {
        //     executor: 'ramping-arrival-rate',
        //     startRate: 10,
        //     timeUnit: '1s',
        //     preAllocatedVUs: 50,
        //     maxVUs: 10000,
        //     stages: [
        //         { duration: '5m', target: 500 }, // More gradual increase
        //         { duration: '5m', target: 1000 },
        //         { duration: '5m', target: 2000 },
        //         { duration: '5m', target: 4000 },
        //         { duration: '5m', target: 6000 },
        //         { duration: '5m', target: 8000 },
        //         { duration: '5m', target: 10000 },
        //     ],
        // },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        errors: ['rate<0.05'], // custom error rate should be below 5%
    },
};

export default function () {
    let res = http.get('http://localhost:3001/complex');
    const checkRes = check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
    });

    if (!checkRes) {
        errorCounter.add(1);
    }
    sleep(1);
}
