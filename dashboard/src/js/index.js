/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import '../css/main.scss';

import navigation from './views/navigation.js';
import heading from './views/heading.js';
import wpt from './views/wpt.js';
import lighthouse from './views/lighthouse.js';
import cloudinary from './views/cloudinary.js';
import { fetchSummary } from './utils.js';

function bindEvents() {
    document.querySelector('.dashboard').addEventListener('click', handleDashboardClick);

    document.getElementById('website-select').addEventListener('change', (e) => {
        e.preventDefault();
        displayWebsiteReport(e.target.value);
    });
}

function handleDashboardClick(e) {
    if (e.target.classList.contains('button-trend')) {
        showDialog(e);
    }
}

function handleCloseDialog() {
    const graphs = document.querySelectorAll('.graph-container .graph');
    const legends = document.querySelectorAll('.graph-container .legend');

    graphs.forEach(function(graph) {
        graph.innerHTML = '';
    });

    legends.forEach(function(legend) {
        legend.innerHTML = '';
    });
}

function showDialog(e) {
    const content = document.querySelector('.mzp-u-modal-content');

    window.Mzp.Modal.createModal(e.target, content, {
        title: e.target.dataset.url,
        closeText: 'Close',
        onCreate: function() {
            wpt.renderGraph(e.target.dataset);
            lighthouse.renderGraph(e.target.dataset);
        },
        onDestroy: handleCloseDialog
    });
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
