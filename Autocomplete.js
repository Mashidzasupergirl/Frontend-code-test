export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [] }, options);
    Object.assign(this, { rootEl, options });

    this.init();
  }

  async onQueryChange(query) {
    // Get data for the dropdown
    if (this.rootEl.id === 'gh-user') {
      const newData = await fetchData(query)
      // console.log(newData)
      let results = this.getResults(query, newData);
      results = results.slice(0, this.options.numOfResults);
      this.updateDropdown(newData);
    }
    else {
      let results = this.getResults(query, this.options.data);
      results = results.slice(0, this.options.numOfResults);
      this.updateDropdown(results);
    }
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    let results = data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results;
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.text,
      });

      // Pass the value to the onSelect callback
      el.addEventListener('click', (event) => {
        const { onSelect } = this.options;
        if (typeof onSelect === 'function') onSelect(result.value);
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    Object.assign(inputEl, {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
    });

    inputEl.addEventListener('input', event =>
      this.onQueryChange(event.target.value));

    let liSelected
    let index = -1
    inputEl.addEventListener('keydown', (e) => {
      e = e || window.event;

      let allLi = this.listEl.getElementsByTagName('li')
      let length = allLi.length

      //down:
      if (e.keyCode === 40) {
        index++
        if (liSelected) {
          liSelected.classList.remove('selected');
          let next = allLi[index];
          if (typeof next !== undefined && index <= length) {

            liSelected = next;
          } else {
            index = 0;
            liSelected = allLi[0];
          }
          liSelected.classList.add('selected');
        } else {
          index = 0;
          liSelected = allLi[0];
          liSelected.classList.add('selected');
        }

      }
      //up:
      else if (e.keyCode === 38) {
        if (liSelected) {
          liSelected.classList.remove('selected');
          index--;
          let next = allLi[index];
          if (typeof next !== undefined && index >= 0) {
            liSelected = next;
          } else {
            index = length;
            liSelected = allLi[length];
          }
          liSelected.classList.add('selected');
        } else {
          index = 0;
          liSelected = allLi[length];
          liSelected.classList.add('selected');
        }
      }
      if (e.key === 'Enter') {
        if (liSelected) {
          inputEl.value = liSelected.textContent;
        }
      }
      // allLi.addEventListener('click', event => {
      //   console.log('first')
      // })
    })

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    Object.assign(this.listEl, { className: 'results' });
    this.rootEl.appendChild(this.listEl);
  }
}

const fetchData = async (query) => {
  const apiResultData = await (fetch(`https://api.github.com/search/users?q=${query}&per_page=$1`).then(data => data.json()))
  return apiResultData.items.map(obj => ({ text: obj.login, value: obj.id })).slice(0, 10)
}

// const inputFields = document.querySelector('.results');

// inputFields.addEventListener('keydown', (e) => {
//   e = e || window.event;
//   if (e.keyCode === 38) {
//     console.log('up arrow pressed')
//   } else if (e.keyCode === 40) {
//     console.log('down arrow pressed')
//   }
// })






// inputEl.addEventListener('keydown', event =>
// {console.log('first')}
// );

// var ul = document.getElementsByClassName('results');
// var liSelected;
// var index = -1;

// document.addEventListener('keydown', function(event) {
//   var len = ul.getElementsByTagName('li').length - 1;
//   if (event.which === 40) {
//     index++;
//     //down
//     if (liSelected) {
//       removeClass(liSelected, 'selected');
//       next = ul.getElementsByTagName('li')[index];
//       if (typeof next !== undefined && index <= len) {

//         liSelected = next;
//       } else {
//         index = 0;
//         liSelected = ul.getElementsByTagName('li')[0];
//       }
//       addClass(liSelected, 'selected');
//       console.log(index);
//     } else {
//       index = 0;

//       liSelected = ul.getElementsByTagName('li')[0];
//       addClass(liSelected, 'selected');
//     }
//   } else if (event.which === 38) {

//     //up
//     if (liSelected) {
//       removeClass(liSelected, 'selected');
//       index--;
//       console.log(index);
//       next = ul.getElementsByTagName('li')[index];
//       if (typeof next !== undefined && index >= 0) {
//         liSelected = next;
//       } else {
//         index = len;
//         liSelected = ul.getElementsByTagName('li')[len];
//       }
//       addClass(liSelected, 'selected');
//     } else {
//       index = 0;
//       liSelected = ul.getElementsByTagName('li')[len];
//       addClass(liSelected, 'selected');
//     }
//   }
// }, false);

// function removeClass(el, className) {
//   if (el.classList) {
//     el.classList.remove(className);
//   } else {
//     el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
//   }
// };

// function addClass(el, className) {
//   if (el.classList) {
//     el.classList.add(className);
//   } else {
//     el.className += ' ' + className;
//   }
// };
