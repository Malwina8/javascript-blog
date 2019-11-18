'use strict';

const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* [DONE]  add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* [DONE]  remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

function calculateTagsClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for (let article of articles) {
  /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* get the title from the title element */
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a<></li>';
    console.log(linkHTML);
    /* insert link into titleList */
    html = html + linkHTML;
    console.log('html');
  }
  titleList.innerHTML= html;
  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

// Generate  tags

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

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const tagWrapper = article.querySelector(optArticleTagsSelector);
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
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('clickedEltag: ' + clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href tag: ' + href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const activeLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let activeLink of activeLinks) {
  /* add class active */
    activeLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('.list a');
  /* START LOOP: for each link */
  for (let link of links) {
  /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

// Generate autors

function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
     let html = '';
    const articleAuthors = article.getAttribute('data-author');
      let authorLink = '<a href="#author-' + articleAuthors + '">' + articleAuthors +'</a>';
      html = html + authorLink;
    if(allAuthors.hasOwnProperty(articleAuthors)) {
        allAuthors[articleAuthors]++;
    } else {
      allAuthors[articleAuthors] = 1;
    }
    authorWrapper.innerHTML = html;
}
  const authorList = document.querySelector('.authors');
  let allAuthorsHtml = '';
  for(let link in allAuthors) {
    const authorLinkHtml = '<li><a href="#author-' + link + '">' + link + '(' + allAuthors[link] +')</a></li>'
    allAuthorsHtml += authorLinkHtml;
    console.log('link: ', link);
    console.log('allAuthors: ', allAuthors);
  }
    authorList.innerHTML = allAuthorsHtml;
}

generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('clickedElauthor: ' + clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href author: ' + href);
  const author = href.replace('#author-', '');
  /* find all tag links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log('actvielinksA: ' + activeAuthorLinks);
  /* START LOOP: for each active tag link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const activeLinks = document.querySelectorAll('a[href="' + author + '"]');
  /* START LOOP: for each found tag link */
  for (let activeLink of activeLinks) {
  /* add class active */
    activeLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  /* find all links to tags */
  const links = document.querySelectorAll('.post-author a');
  /* START LOOP: for each link */
  for (let link of links) {
  /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
