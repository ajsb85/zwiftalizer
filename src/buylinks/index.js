import React from 'react';

import {
  AMAZON_US_LABEL,
  AMAZON_UK_LABEL,
  AMAZON_US_TAG,
  AMAZON_UK_TAG
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
