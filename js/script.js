'use strict';

const opt = {
  aticleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-'
};

const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts .active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  targetArticle.classList.add('active');
};

function calculateTagsClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opt.cloudClassCount - 1) + 1);
  return opt.cloudClassPrefix + classNumber;
}

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(opt.titleListSelector);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(opt.aticleSelector + customSelector);
  let html = '';
  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a<></li>';
    console.log(linkHTML);
    html = html + linkHTML;
  }
  titleList.innerHTML= html;
  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let tag in tags) {
    console.log('tag and tags: ' + tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if(tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

// Generate  tags

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(opt.aticleSelector);
  for (let article of articles) {
    const tagWrapper = article.querySelector(opt.articleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for (let tag of articleTagsArray) {
      const tagHtml = '<li><a href="#tag-' + tag + '">' + tag + ' </a></li>';
      html = html + tagHtml;
      if(!allTags[tag]) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = '';
  for(let tag in allTags) {
    const tagLinkHTML = '<li><a href="#tag-' + tag + '"class="' + calculateTagsClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
    allTagsHTML += tagLinkHTML;
  }
  tagList.innerHTML = allTagsHTML;
  addClickListenersToTags();
}

generateTags();

function tagClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('clickedEltag: ' + clickedElement);
  const href = clickedElement.getAttribute('href');
  console.log('href tag: ' + href);
  const tag = href.replace('#tag-', '');
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  for (let activeTagLink of activeTagLinks) {
    activeTagLink.classList.remove('active');
  }
  const activeLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let activeLink of activeLinks) {
    activeLink.classList.add('active');
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
}

function addClickListenersToTags(){
  const links = document.querySelectorAll('.list a' + ',' + '.lista a');
  for (let link of links) {
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();

// Generate autors

function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(opt.aticleSelector);
  for (let article of articles) {
    const authorWrapper = article.querySelector(opt.articleAuthorSelector);
    let html = '';
    const articleAuthors = article.getAttribute('data-author');
    let authorLink = '<a href="#author-' + articleAuthors + '">' + articleAuthors +'</a>';
    html = html + authorLink;
    if(allAuthors[articleAuthors]) {
      allAuthors[articleAuthors]++;
    } else {
      allAuthors[articleAuthors] = 1;
    }
    authorWrapper.innerHTML = html;
  }
  const authorList = document.querySelector('.authors');
  let allAuthorsHtml = '';
  for(let link in allAuthors) {
    const authorLinkHtml = '<li><a href="#author-' + link + '">' + link + ' (' + allAuthors[link] +')</a></li>';
    allAuthorsHtml += authorLinkHtml;
    console.log('link: ', link);
    console.log('allAuthors: ', allAuthors);
  }
  authorList.innerHTML = allAuthorsHtml;
}

generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('clickedElauthor: ' + clickedElement);
  const href = clickedElement.getAttribute('href');
  console.log('href author: ' + href);
  const author = href.replace('#author-', '');
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log('actvielinksA: ' + activeAuthorLinks);
  for (let activeAuthorLink of activeAuthorLinks) {
    activeAuthorLink.classList.remove('active');
  }
  const activeLinks = document.querySelectorAll('a[href="' + author + '"]');
  for (let activeLink of activeLinks) {
    activeLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  const links = document.querySelectorAll('.post-author a' + ',' + '.sidebar .list a');
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
