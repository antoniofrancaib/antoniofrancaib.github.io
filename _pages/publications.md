---
layout: page
permalink: /publications/
title: publications
description: I try to keep this list updated but feel free to take a look at my Google Scholar
years: [2022, 2021, 2020]
nav: true
---
<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
