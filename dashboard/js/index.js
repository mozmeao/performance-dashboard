/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import navigation from './views/navigation.js';
import heading from './views/heading.js';
import wpt from './views/wpt.js';
import lighthouse from './views/lighthouse.js';
import cloudinary from './views/cloudinary.js';
import { fetchSummary } from './utils.js';

const dialog = document.querySelector('dialog');

function bindEvents() {
    document.querySelector('.dashboard').addEventListener('click', handleDashboardClick);
    dialog.addEventListener('close', handleCloseDialog);

    document.getElementById('website-select').addEventListener('change', (e) => {
        e.preventDefault();
        displayWebsiteReport(e.target.value);
    });
}

function handleDashboardClick(e) {
    if (e.target.className === 'button-trend') {
        showDialog(e.target.dataset);
    }
}

function handleCloseDialog() {
    const graphs = document.querySelectorAll('.graph');

    graphs.forEach(function(graph) {
        graph.innerHTML = '';
    });
}

function showDialog(dataset) {
    if (dataset.origin === 'wpt') {
        wpt.renderGraph(dataset);
    } else if (dataset.origin === 'lighthouse') {
        lighthouse.renderGraph(dataset);
    }

    window.dialogPolyfill.registerDialog(dialog);
    dialog.showModal();
}

function displayWebsiteReport(report) {
    const dashboard = document.querySelector('.dashboard');
    fetchSummary(report).then(site => {
        const pageHeading = heading.render(site);
        const wptTable = wpt.render(site);
        const lighthouseTable = lighthouse.render(site);
        const cloudinaryTable = cloudinary.render(site);
        dashboard.innerHTML = pageHeading + wptTable + lighthouseTable + cloudinaryTable;
    });
}

fetchSummary('index.json').then(data => {
    const menu = navigation.render(data);
    document.querySelector('nav').insertAdjacentHTML('beforeend', menu);
    bindEvents();
});
