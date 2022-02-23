$(function () {

    const main_cat = localize.main_cat, // functionに記述したカテゴリのスラッグを取得
      area_cat = localize.area_cat, // functionに記述したカテゴリのスラッグを取得
      main_tag = localize.main_tag, // functionに記述したカテゴリのスラッグを取得
      menu_cat = localize.menu_cat, // functionに記述したカテゴリのスラッグを取得
      path = window.location.pathname, // 現在のURLのパスを特定
      key_area = $('input[class="keyword__text"]'),
      ajax_fanc = function () {
        ajax_side(); // AJAX(絞り込み検索)
        ajax_result(); // AJAX(結果)
      },
      key_ajax_func = function () {
        check_hide(); // 現在選択されているチェックボックスを外す
        ajax_side(); // AJAX(絞り込み検索)
        ajax_result(); // AJAX(結果)
      };
  
    let cat_val,
      menu_val,
      area_val,
      tag_val,
      key_val,
      paged,
      main_res;
  
    check_url(); // URLからチェックしている要素を抜き出す
    ajax_open_side(); // 画面を読み込んだときのAJAX(絞り込み検索)
    ajax_open_result();
    key_area.val(key_val);
  
    // キーワード検索を送信したらAJAXを読み込む
    $(document).on('submit', "form[class='keywordform']", key_ajax_func);
    // 上部の選択済みカテゴリ、モーダル背景、検索ボタンをクリックしたときAJAXを読み込む
    $(document).on('click', '.checkhide_js, .overlay_side, .searchbutton, .cat__deselection_js', ajax_fanc);
    // 読み込んだチェックボックスが変更されたらAJAXを読み込む（こだわり検索）
    $(document).on('change', `input[name='${main_tag}[]']`, ajax_fanc);
  
    // リロード用のURLからチェックしている要素を抜き出す記述
    function check_url() { // 関数を作成
  
      // URLを取得
      const url = new URL(window.location.href);
      // URLからカテゴリ(shop_cat)のパラメータ配列を取得し、変数arrayに入れる
      cat_val = url.searchParams.getAll('gourmet_style_cat[]');
      // URLからカテゴリ(shop_cat)のパラメータ配列を取得し、変数arrayに入れる
      menu_val = url.searchParams.getAll('gourmet_menu[]');
      // カテゴリ(area_cat)のパラメータ配列を追加
      area_val = url.searchParams.getAll('area_cat[]');
      // カテゴリ(shop_kodawari)のパラメータ配列を追加
      tag_val = url.searchParams.getAll('shop_kodawari[]');
      // ページ番号のパラメータ配列を追加
      paged = url.searchParams.get('paged');
      // キーワードのパラメータを追加
      key_val = url.searchParams.getAll('fw');
    };
  
    function ajax_open_side() { // 関数を作成
      dispLoading(); // 画面を読み込んだ時のローディング画像表示
  
      $.ajax({
          type: 'GET',
          url: localize.ajax_url,
          data: {
            'action': localize.action,
            'nonce': localize.nonce2,
            'gourmet_style_cat': cat_val,
            'area_cat': area_val,
            'gourmet_menu': menu_val,
            'shop_kodawari': tag_val,
            's': key_val
          }
        })
        .done(function (response) {
          main_res = response;
          $('#search_js').html(main_res);
          check_now_cat_view();
        })
  
        // 処理終了時
        .always(function (response) {
          removeLoading();
        });
  
      return false;
    }
  
    function ajax_open_result() { // 関数を作成
  
      $.ajax({
          type: 'GET',
          url: localize.ajax_url,
          data: {
            'action': localize.action,
            'nonce': localize.nonce,
            'gourmet_style_cat': cat_val,
            'area_cat': area_val,
            'gourmet_menu': menu_val,
            'shop_kodawari': tag_val,
            'paged': paged,
            's': key_val,
            'url': window.location.pathname
          }
        })
        .done(function (response) {
          main_res = response;
          $('#result').html(main_res);
        })
  
        // 処理終了時
        .always(function (response) {});
  
      return false;
    };
  
    function ajax_side() { // 関数を作成
      dispLoading(); // 画面を読み込んだ時のローディング画像表示
      // 使う変数を宣言
      let url_val = [],
        cat_val = [],
        area_val = [],
        menu_val = [],
        tag_val = [],
        url_all_val = '',
        par_val = '';
      // キーワードの取得
      key_val = $("input[name='s']").val();
      // キーワードのパラメータ作成
      if (key_val != "") {
        par_val = 'fw=' + key_val;
        url_val.push(par_val);
      }
      // メインカテゴリの取得
      ajax_side_val(main_cat, cat_val);
      // エリアカテゴリの取得
      ajax_side_val(area_cat, area_val);
      // メニューカテゴリの取得
      ajax_side_val(menu_cat, menu_val);
      // こだわり検索の取得
      ajax_side_val(main_tag, tag_val);
  
      // チェックしたチェックボックスを拾い出す関数
      function ajax_side_val(cat, val) {
        $(`input[name='${cat}[]']:checked`).each(function () {
          val.push(this.value);
        });
        if (val.length != 0) {
          ajax_url(cat, val);
        }
      }
      // URLの生成関数
      function ajax_url(c, vl) {
        $.each(vl, function (i, v) {
          par_val = c + '%5B%5D=' + v;
          url_val.push(par_val);
        });
      }
  
      // すべてのパラメータの作成
      if (url_val.length != 0) {
        $.each(url_val, function (i, v) {
          if (i === 0) {
            url_all_val += v;
          } else {
            url_all_val += '&' + v;
          }
        });
      }
  
      $.ajax({
          type: 'GET',
          url: localize.ajax_url,
          data: {
            'action': localize.action,
            'nonce': localize.nonce2,
            'gourmet_style_cat': cat_val,
            'area_cat': area_val,
            'gourmet_menu': menu_val,
            'shop_kodawari': tag_val,
            's': key_val
          }
        })
        .done(function (response) {
          main_res = response;
          $('#search_js').html(main_res);
          check_now_cat_view();
          if (url_all_val != '') {
            // カテゴリがチェックされていればURLを追加する。（ブラウザの戻るボタンに対応するため）
            history.pushState({
              page_side: main_res
            }, null, `${path}?${url_all_val}`); // 複数を選択した場合はまだ未完成
  
          } else {
            history.replaceState({
              page_side: main_res
            }, null, path);
          }
        })
  
        // 処理終了時
        .always(function (response) {
          removeLoading();
        });
  
      return false;
    }
  
    function ajax_result() { // 関数を作成
      // 使う変数を宣言
      let cat_val = [],
        area_val = [],
        menu_val = [],
        tag_val = [];
      // メインカテゴリの取得
      ajax_result_val(main_cat, cat_val);
      // エリアカテゴリの取得
      ajax_result_val(area_cat, area_val);
      // メニューカテゴリの取得
      ajax_result_val(menu_cat, menu_val);
      // こだわり検索の取得
      ajax_result_val(main_tag, tag_val);
      // チェックしたチェックボックスを拾い出す関数
      function ajax_result_val(cat, val) {
        $(`input[name='${cat}[]']:checked`).each(function () {
          val.push(this.value);
        });
      }
      // キーワードの取得
      key_val = $("input[name='s']").val();
  
      $.ajax({
          type: 'GET',
          url: localize.ajax_url,
          data: {
            'action': localize.action,
            'nonce': localize.nonce,
            'gourmet_style_cat': cat_val,
            'area_cat': area_val,
            'gourmet_menu': menu_val,
            'shop_kodawari': tag_val,
            'paged': paged,
            's': key_val,
            'url': window.location.pathname
          }
        })
        .done(function (response) {
          main_res = response;
          $('#result').html(main_res);
        })
  
        // 処理終了時
        .always(function (response) {});
  
      return false;
    };
  
    // 現在選択されているチェックボックスを外す
    function check_hide() {
      let input = $('input[type="checkbox"]:checked');
      input.each(function () {
        $(this).prop('checked', false);
        console.log(this);
      });
    };
  
    // 戻るボタンを押したときに前の画面を呼び出す
    window.addEventListener("popstate", function (event) {
      $('#search_js').html(event.state.page_side);
      check_url();
      key_area.val(key_val);
      check_now_cat_view();
      ajax_result();
    });
  
    /* ------------------------------
     メインLoading
     ------------------------------ */
    function dispLoading(msg) {
      if (msg == undefined) {
        msg = "";
      }
      let dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
      if ($("#loading").length == 0) {
        $("body").append("<div id='loading'>" + dispMsg + "</div>");
      }
    }
  
    function removeLoading() {
      $("#loading").fadeOut('fast').queue(function () {
        $("#loading").remove();
      })
    }
  
    /* ------------------------------
     件数表示AJAX
     ------------------------------ */
  
    function ajaxcounter() { // 関数を作成
      // counterLoading(); // 画面を読み込んだ時のローディング画像表示
      // 使う変数を宣言
      let cat_val = [],
        area_val = [],
        menu_val = [],
        tag_val = [];
      // メインカテゴリの取得
      ajax_result_val(main_cat, cat_val);
      // エリアカテゴリの取得
      ajax_result_val(area_cat, area_val);
      // メニューカテゴリの取得
      ajax_result_val(menu_cat, menu_val);
      // こだわり検索の取得
      ajax_result_val(main_tag, tag_val);
      // チェックしたチェックボックスを拾い出す関数
      function ajax_result_val(cat, val) {
        $(`input[name='${cat}[]']:checked`).each(function () {
          val.push(this.value);
        });
      }
      // キーワードの取得
      key_val = $("input[name='s']").val();
  
      $.ajax({
          type: 'GET',
          url: localize.ajax_url,
          data: {
            'action': localize.action,
            'nonce': localize.nonce_count,
            'gourmet_style_cat': cat_val,
            'gourmet_menu': menu_val,
            'area_cat': area_val,
            'shop_kodawari': tag_val,
            's': key_val
          }
        })
        .done(function (response) {
          main_res = response;
          $('.searchbutton').html(main_res);
        })
  
        // 処理終了時
        .always(function (response) {
          // removecounterLoading();
        });
  
      return false;
    }
  
    // チェックボックスを押したら件数を表示
    $(document).on('change', "input[type='checkbox']", function () {
      ajaxcounter();
    });
  
    /* ------------------------------
     件数Loading
     ------------------------------ */
    function counterLoading(msg) {
      if (msg == undefined) {
        msg = "";
      }
      let dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
      if ($("#loading").length == 0) {
        $(".result__title").append("<div id='loading'>" + dispMsg + "</div>");
      }
    }
  
    function removecounterLoading() {
      $("#loading").fadeOut('fast').queue(function () {
        $("#loading").remove();
      })
    }
  
    // モーダル内のチェックボックスをクリックで上部にアイコン表示
    $(document).on('click', '.active__check_js', function () {
      let search_area = $(this).parents('.fadecate'),
        checked = search_area.find('input[type="checkbox"]:checked'),
        check_title = search_area.find('.choice__group');
      if (checked.length != 0) {
        let val = '';
        $.each(checked, function (i, v) {
          let text = $(v).next().text(),
            check_val = $(v).val();
          val += `<li class="choice__group_term checkhide__modal_js" data-id="${check_val}"><span>${text}</span></li>`;
        });
        check_title.html(val);
      } else {
        check_title.html('');
      }
    });
  
    // メニューをチェックしたらタブに選択中の文字を表示する
    $(document).on('click', '.acd_openist_checkbox', function () {
      let tab = $(this).parents('.menu_item'),
        label = tab.find('.select__deselection'),
        box = tab.children('.acd_openbox'),
        box_ac = box.find('input[type="checkbox"]:checked');
      if (box_ac.length != 0) {
        label.html('選択中');
      } else {
        label.html('');
      }
    });
  
    // AJAX読み込み後のモーダル内のアイコン表示
    function check_now_cat_view() {
      let side = $('#sidearea'),
        select_check = side.find('.select');
      select_check.each(function (i, v) { // 大カテゴリ(select)要素を繰り返し処理
        let search_area = $(v).children('.fadecate'), // select内のモーダル要素(fadecate)を代入
          checked = search_area.find('input[type="checkbox"]:checked'), // モーダル内のチェックされているものを代入
          active_check = search_area.find('.active__text_js'), // 検索結果に含まれるカテゴリ判断用のclassを代入
          check_title = search_area.find('.choice__group'), // 現状選択しているカテゴリを表示する箇所を代入
          menu_tab = search_area.find('.menu_item');
  
        if (active_check.length == 0 && checked.length == 0) { // 現状の大カテゴリに含まれるカテゴリが検索結果の中になければ
          $(v).children('.select__parent').addClass('none'); // カテゴリを選択できないようにする
        } else {
          $(menu_tab).each(function (i, va) {
            let menu_check = $(va).find('.active__text_js'),
              menu_checked = $(va).find('input[type="checkbox"]:checked');
            if (menu_check.length == 0 && menu_checked.length == 0) {
              $(va).addClass('none');
            }
          });
        }
  
        if (checked.length != 0) {
          let val = '',
            choice = $(v).find('.select__etc');
          choice.before('<span class="select__deselection">選択中</span>');
          $.each(checked, function (i, v) {
            let text = $(v).next().text(),
              check_val = $(v).val();
            val += `<li class="choice__group_term checkhide__modal_js" data-id="${check_val}"><span>${text}</span></li>`;
          });
          check_title.html(val);
        } else {
          check_title.html('');
        }
  
        menu_tab.each(function (i, b) {
          box_ac = $(b).find('input[type="checkbox"]:checked');
          label = $(b).find('.select__deselection');
          if (box_ac.length != 0) {
            label.html('<span class="select__deselection">選択中</span>');
          }
        });
      });
    };
  
    // モーダル内の現在選択しているアイコンをクリックでチェックを外す
    $(document).on('click', '.checkhide__modal_js', function () {
      let term_id = $(this).data('id'),
        cat_area = $(this).parents('.fadecate'),
        select_term = cat_area.find(`input[value="${term_id}"]`);
      select_term.prop('checked', false).change();
      $(this).remove();
    });
  
    let page_url = '';
    // ページネーションをクリックしたときにページ遷移させない
    $(document).on('click', '.page-numbers', function (e) {
      e.preventDefault();
      let h = $(this).attr('href');
      if (h != undefined) {
        page_url = new URL(h);
        paged = page_url.searchParams.get('paged');
        ajax_paginate();
      }
      return false;
    });
  
  
    function ajax_paginate() { // 関数を作成
      dispLoading(); // 画面を読み込んだ時のローディング画像表示
  
      $.ajax({
          type: 'GET',
          url: localize.ajax_url,
          data: {
            'action': localize.action,
            'nonce': localize.nonce,
            'gourmet_style_cat': cat_val,
            'area_cat': area_val,
            'gourmet_menu': menu_val,
            'shop_kodawari': tag_val,
            'paged': paged,
            's': key_val,
            'url': window.location.pathname
          }
        })
        .done(function (response) {
          main_res = response;
          $('#result').html(main_res);
          history.pushState({
            page_nate: main_res
          }, null, page_url);
        })
  
        // 処理終了時
        .always(function (response) {
          removeLoading();
        });
  
      return false;
    };
  
  
    // URLを取得
    // let page_url = new URL(href);
    // paged = page_url.searchParams.get('paged');
  
  
  });