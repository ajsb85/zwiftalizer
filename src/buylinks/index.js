
import React from 'react';

import {
    AMAZON_US_LABEL,
    AMAZON_CA_LABEL,
    AMAZON_UK_LABEL,
    AMAZON_DE_LABEL,
    AMAZON_ES_LABEL,
    AMAZON_FR_LABEL,
    AMAZON_IT_LABEL,
    AMAZON_US_TAG,
    AMAZON_CA_TAG,
    AMAZON_UK_TAG,
    AMAZON_DE_TAG,
    AMAZON_ES_TAG,
    AMAZON_FR_TAG,
    AMAZON_IT_TAG
  } from '../constants/index.js';

  export function renderBuyLink(item) {    
    const buyLinks = [];
    const buyQueryTerms = item.toLowerCase().replace(' ', '+');

    buyLinks.push({
      tag: AMAZON_US_LABEL,
      href: `https://www.amazon.com/s?tag=${AMAZON_US_TAG}&keywords=${buyQueryTerms}`
    });

    buyLinks.push({
      tag: AMAZON_UK_LABEL,
      href: `https://www.amazon.co.uk/s/?tag=${AMAZON_UK_TAG}&field-keywords=${buyQueryTerms}`
    });

    buyLinks.push({
      tag: AMAZON_CA_LABEL,
      href: `https://www.amazon.ca/s/?tag=${AMAZON_CA_TAG}&field-keywords=${buyQueryTerms}`
    });

    buyLinks.push({
      tag: AMAZON_DE_LABEL,
      href: `https://www.amazon.de/s/?tag=${AMAZON_DE_TAG}&field-keywords=${buyQueryTerms}`
    });

    buyLinks.push({
      tag: AMAZON_ES_LABEL,
      href: `https://www.amazon.es/s/?tag=${AMAZON_ES_TAG}&field-keywords=${buyQueryTerms}`
    });

    buyLinks.push({
      tag: AMAZON_FR_LABEL,
      href: `https://www.amazon.fr/s/?tag=${AMAZON_FR_TAG}&field-keywords=${buyQueryTerms}`
    });

    buyLinks.push({
      tag: AMAZON_IT_LABEL,
      href: `https://www.amazon.it/s/?tag=${AMAZON_IT_TAG}&field-keywords=${buyQueryTerms}`
    });

    const buyLinksMarkup = buyLinks.map(function(link, i) {
      return (
        <li key={i}>
          <a target="_blank" href={link.href}>
            {link.tag}
          </a>
        </li>
      );
    }, this);

    return buyLinksMarkup;
  }
