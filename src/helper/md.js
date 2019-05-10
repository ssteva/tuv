 export class Altairmaterialinit {
    card_fullscreen() {
        $('.md-card-fullscreen-activate').on('click', function () {
            var $thisCard = $(this).closest('.md-card');

            if (!$thisCard.hasClass('md-card-fullscreen')) {
                // get card atributes
                var mdCard_h = $thisCard.height(),
                    mdCardToolbarFixed = $(this).hasClass('toolbar_fixed'),
                    mdCard_w = $thisCard.width(),
                    body_scroll_top = $('body').scrollTop(),
                    mdCard_offset = $thisCard.offset();

                // create placeholder for card
                $thisCard.after('<div class="md-card-placeholder" style="width:' + mdCard_w + 'px;height:' + mdCard_h + 'px;"/>');
                // add overflow hidden to #page_content (fix for ios)
                //$('body').addClass('md-card-fullscreen-active');
                // add width/height to card (preserve original size)
                $thisCard
                    .addClass('md-card-fullscreen')
                    .css({
                        'width': mdCard_w,
                        'height': mdCard_h,
                        'left': mdCard_offset.left,
                        'top': mdCard_offset.top - body_scroll_top
                    })
                    // animate card to top/left position
                    .velocity(
                        {
                            left: 0,
                            top: 0
                        },
                        {
                            duration: 400,
                            easing: easing_swiftOut,
                            begin: function (elements) {
                                // add back button
                                var $toolbar = $thisCard.find('.md-card-toolbar');
                                if ($toolbar.length) {
                                    $toolbar.prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                                } else {
                                    $thisCard.append('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-position-top-right" style="margin:10px 10px 0 0">&#xE5CD;</span>')
                                }
                                altair_page_content.hide_content_sidebar();
                            }
                        }
                    // resize card to full width/height
                    ).velocity(
                        {
                            height: '100%',
                            width: '100%'
                        },
                        {
                            duration: 400,
                            easing: easing_swiftOut,
                            complete: function (elements) {
                                // show fullscreen content
                                $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                    duration: 400,
                                    easing: easing_swiftOut,
                                    complete: function (elements) {
                                        // activate onResize callback for some js plugins
                                        $(window).resize();
                                    }
                                });
                                if (mdCardToolbarFixed) {
                                    $thisCard.addClass('mdToolbar_fixed')
                                }
                            }
                        }
                    );
            }
        });

        $('#page_content').on('click', '.md-card-fullscreen-deactivate', function () {
            // get card placeholder width/height and offset
            var $thisPlaceholderCard = $('.md-card-placeholder'),
                mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                body_scroll_top = $('body').scrollTop(),
                mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top - body_scroll_top,
                mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                $thisCard = $('.md-card-fullscreen'),
                mdCardToolbarFixed = $thisCard.hasClass('mdToolbar_fixed');

            $thisCard
                // resize card to original size
                .velocity(
                    {
                        height: mdPlaceholderCard_h,
                        width: mdPlaceholderCard_w
                    },
                    {
                        duration: 400,
                        easing: easing_swiftOut,
                        begin: function (elements) {
                            // hide fullscreen content
                            $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut", { duration: 275, easing: easing_swiftOut });
                            if (mdCardToolbarFixed) {
                                $thisCard.removeClass('mdToolbar_fixed')
                            }
                        },
                        complete: function (elements) {
                            // activate onResize callback for js plugins
                            $window.resize();
                            // remove back button
                            $thisCard.find('.md-card-fullscreen-deactivate').remove();
                            altair_page_content.show_content_sidebar();
                        }
                    }
                )
                // move card to original position
                .velocity(
                    {
                        left: mdPlaceholderCard_offset_left,
                        top: mdPlaceholderCard_offset_top
                    },
                    {
                        duration: 400,
                        easing: easing_swiftOut,
                        complete: function (elements) {
                            // remove some styles added by velocity.js
                            $thisCard.removeClass('md-card-fullscreen').css({
                                width: '',
                                height: '',
                                left: '',
                                top: ''
                            });
                            // remove card placeholder
                            $thisPlaceholderCard.remove();
                            // remove overflow:hidden from #page_content (ios fix)
                            $('body').removeClass('md-card-fullscreen-active');
                        }
                    }
                );
        });
    }
    card_expand(){
        // expand elements
        $(".md-expand").velocity("transition.expandIn", { stagger: 175, drag: true });
        $(".md-expand-group").children().velocity("transition.expandIn", { stagger: 175, drag: true });
    }
    card_overlay() {
        var $md_card = $('.md-card');

        // replace toggler icon (x) when overlay is active
        $md_card.each(function () {
            var $this = $(this);
            if ($this.hasClass('md-card-overlay-active')) {
                $this.find('.md-card-overlay-toggler').html('&#xE5CD;')
            }
        });

        // toggle card overlay
        $md_card.on('click', '.md-card-overlay-toggler', function (e) {
            e.preventDefault();
            if (!$(this).closest('.md-card').hasClass('md-card-overlay-active')) {
                $(this)
                    .html('&#xE5CD;')
                    .closest('.md-card').addClass('md-card-overlay-active');

            } else {
                $(this)
                    .html('&#xE5D4;')
                    .closest('.md-card').removeClass('md-card-overlay-active');
            }
        })
    }
    card_single() {
        var $md_card_single = $('.md-card-single');
        if ($md_card_single && $('body').hasClass('header_double_height')) {
            function md_card_content_height() {
                var content_height = $window.height() - ((header__main_height * 2) + 12);
                $md_card_single.find('.md-card-content').innerHeight(content_height);
            }
            md_card_content_height();
            $window.on('debouncedresize', function () {
                md_card_content_height();
            });
        }
    }
    card_panel() {

        $('.md-card-close').on('click', function (e) {
            e.preventDefault();
            var $this = $(this),
                thisCard = $this.closest('.md-card'),
                removeCard = function () {
                    $(thisCard).remove();
                };
            altair_md.card_show_hide(thisCard, undefined, removeCard)
        });

        $('.md-card-toggle').on('click', function (e) {
            e.preventDefault();
            var $this = $(this),
                thisCard = $this.closest('.md-card');

            $(thisCard).toggleClass('md-card-collapsed').children('.md-card-content').slideToggle('280', bez_easing_swiftOut);

            $this.velocity({
                scale: 0,
                opacity: 0.2
            }, {
                duration: 280,
                easing: easing_swiftOut,
                complete: function () {
                    $(thisCard).hasClass('md-card-collapsed') ? $this.html('&#xE313;') : $this.html('&#xE316;');
                    $this.velocity('reverse');
                    $window.resize();
                }
            });

        });

        $('.md-card-collapsed').each(function () {
            var $card = $(this),
                $this_toggle = $card.find('.md-card-toggle');

            $this_toggle.html('&#xE313;');
            $card.children('.md-card-content').hide();
        })

    }
    card_show_hide(card, begin_callback, complete_callback, callback_element) {
        $(card)
            .velocity({
                scale: 0,
                opacity: 0.2
            }, {
                duration: 400,
                easing: easing_swiftOut,
                // on begin callback
                begin: function () {
                    if (typeof begin_callback !== 'undefined') {
                        begin_callback(callback_element);
                    }
                },
                // on complete callback
                complete: function () {
                    if (typeof complete_callback !== 'undefined') {
                        complete_callback(callback_element);
                    }
                }
            })
            .velocity('reverse');
    }
    card_progress(card, percent, steps) {
        var $toolbar_progress = card ? $(card).children('.md-card-toolbar') : $('[data-toolbar-progress]');
        $toolbar_progress.each(function () {
            var $this = $(this),
                bg_percent = percent ? parseInt(percent) : parseInt($this.attr('data-toolbar-progress')),
                progress_steps = $this.attr('data-toolbar-progress-steps');

            if (steps || progress_steps) {
                if (bg_percent > 66) {
                    var bg_color = '#dcedc8';
                } else if (bg_percent > 33) {
                    var bg_color = '#ffecb3';
                } else {
                    var bg_color = '#ffcdd2';
                }
            } else {
                var bg_color_default = $this.attr('data-toolbar-bg-default');
                if (!bg_color_default) {
                    var bg_color = $this.css('backgroundColor');
                    $this.attr('data-toolbar-bg-default', bg_color)
                } else {
                    var bg_color = bg_color_default;
                }
            }

            if (percent) {
                $this.attr('data-toolbar-progress', percent);
            }

            var bg_theme = '#fff';

            $this
                .css({ 'background': '-moz-linear-gradient(left, ' + bg_color + ' ' + bg_percent + '%, ' + bg_theme + ' ' + (bg_percent) + '%)' })
                .css({ 'background': 'linear-gradient(to right,  ' + bg_color + ' ' + bg_percent + '%, ' + bg_theme + ' ' + (bg_percent) + '%)' })
                .css({ 'background': '-webkit-linear-gradient(left, ' + bg_color + ' ' + bg_percent + '%, ' + bg_theme + ' ' + (bg_percent) + '%)' });

        })
    }
    list_outside() {
        var $md_list_outside_wrapper = $('.md-list-outside-wrapper');
        if ($md_list_outside_wrapper && $('body').hasClass('header_double_height')) {
            function md_list_outside_height() {
                // check header height
                var content_height = $window.height() - ((header__main_height * 2) + 10);
                $md_list_outside_wrapper.height(content_height);
            }
            md_list_outside_height();
            $window.on('debouncedresize', function () {
                md_list_outside_height();
            });
            altair_helpers.custom_scrollbar($md_list_outside_wrapper);
        }
    }
    inputs(parent) {
        var $mdInput = (typeof parent === 'undefined') ? $('.md-input') : $(parent).find('.md-input');
        var update_input = function(object) {
            // clear wrapper classes
            object.closest('.uk-input-group').removeClass('uk-input-group-danger uk-input-group-success');
            object.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

            if (object.hasClass('md-input-danger')) {
                if (object.closest('.uk-input-group').length) {
                    object.closest('.uk-input-group').addClass('uk-input-group-danger')
                }
                object.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
            }
            if (object.hasClass('md-input-success')) {
                if (object.closest('.uk-input-group').length) {
                    object.closest('.uk-input-group').addClass('uk-input-group-success')
                }
                object.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
            }
            if (object.prop('disabled')) {
                object.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
            }
            if (object.val() != '') {
                object.closest('.md-input-wrapper').addClass('md-input-filled')
            } else {
                object.closest('.md-input-wrapper').removeClass('md-input-filled')
            }
            if (object.hasClass('label-fixed')) {
                object.closest('.md-input-wrapper').addClass('md-input-filled')
            }
        }
        $mdInput.each(function () {
            if (!$(this).closest('.md-input-wrapper').length) {
                var $this = $(this),
                    extraClass = '';

                if ($this.is('[class*="uk-form-width-"]')) {
                    var elClasses = $this.attr('class').split(' ');
                    for (var i = 0; i < elClasses.length; i++) {
                        var classPart = elClasses[i].substr(0, 14);
                        if (classPart == "uk-form-width-") {
                            var extraClass = elClasses[i];
                        }
                    }
                }

                if ($this.prev('label').length) {
                    $this.prev('label').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                } else if ($this.siblings('[data-uk-form-password]').length) {
                    $this.siblings('[data-uk-form-password]').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                } else {
                    $this.wrap('<div class="md-input-wrapper"/>');
                }
                $this.closest('.md-input-wrapper').append('<span class="md-input-bar ' + extraClass + '"/>');

                update_input($this);
            }
            $('body')
                .on('focus', '.md-input', function () {
                    $(this).closest('.md-input-wrapper').addClass('md-input-focus')
                })
                .on('blur', '.md-input', function () {
                    $(this).closest('.md-input-wrapper').removeClass('md-input-focus');
                    if (!$(this).hasClass('label-fixed')) {
                        if ($(this).val() != '') {
                            $(this).closest('.md-input-wrapper').addClass('md-input-filled')
                        } else {
                            $(this).closest('.md-input-wrapper').removeClass('md-input-filled')
                        }
                    }
                })
                .on('change', '.md-input', function () {
                    update_input($(this));
                });
        })
    }
    checkbox_radio(checkbox) {
        var mdCheckbox = (typeof checkbox === 'undefined') ? $("[data-md-icheck],.data-md-icheck") : $(checkbox);
        mdCheckbox.each(function () {
            if (!$(this).next('.iCheck-helper').length) {
                $(this)
                    .iCheck({
                        checkboxClass: 'icheckbox_md',
                        radioClass: 'iradio_md',
                        increaseArea: '20%'
                    })
                    // validate inputs on change (parsley)
                    .on('ifChanged', function (event) {
                        if (!!$(this).data('parsley-multiple')) {
                            $(this).parsley().validate();
                        }
                    });
            }
        });
    }

    fab_speed_dial() {
        function toggleFAB(obj) {
            var $this = $(obj),
                $this_wrapper = $this.closest('.md-fab-wrapper');

            $this_wrapper.toggleClass('md-fab-active');

            $this.velocity({
                scale: 0
            }, {
                duration: 140,
                easing: easing_swiftOut,
                complete: function () {
                    $this
                        .velocity({
                            scale: 1
                        }, {
                            duration: 140,
                            easing: easing_swiftOut
                        })
                        .children().toggle()
                }
            })
        }
        $('.md-fab-speed-dial,.md-fab-speed-dial-horizontal')
            .children('.md-fab')
            .append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>')
            .on('click', function () {
                toggleFAB(this)
            })
            .closest('.md-fab-wrapper').find('.md-fab-small')
            .on('click', function () {
                toggleFAB($(this).closest('.md-fab-wrapper').children('.md-fab'));
            });
    }
    fab_toolbar() {
        var $fab_toolbar = $('.md-fab-toolbar');

        if ($fab_toolbar) {
            $fab_toolbar
                .children('i')
                .on('click', function (e) {
                    e.preventDefault();

                    var toolbarItems = $fab_toolbar.children('.md-fab-toolbar-actions').children().length;

                    $fab_toolbar.addClass('md-fab-animated');

                    var FAB_padding = !$fab_toolbar.hasClass('md-fab-small') ? 16 : 24,
                        FAB_size = !$fab_toolbar.hasClass('md-fab-small') ? 64 : 44;

                    setTimeout(function () {
                        $fab_toolbar
                            .width((toolbarItems * FAB_size + FAB_padding))
                    }, 140);

                    setTimeout(function () {
                        $fab_toolbar.addClass('md-fab-active');
                    }, 420);

                });

            $(document).on('click scroll', function (e) {
                if ($fab_toolbar.hasClass('md-fab-active')) {
                    if (!$(e.target).closest($fab_toolbar).length) {

                        $fab_toolbar
                                .css('width', '')
                                .removeClass('md-fab-active');

                        setTimeout(function () {
                            $fab_toolbar.removeClass('md-fab-animated');
                        }, 140);

                    }
                }
            });
        }
    }
    fab_sheet() {
        var $fab_sheet = $('.md-fab-sheet');

        if ($fab_sheet) {
            $fab_sheet
                .children('i')
                .on('click', function (e) {
                    e.preventDefault();

                    var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                    $fab_sheet.addClass('md-fab-animated');

                    setTimeout(function () {
                        $fab_sheet
                            .width('240px')
                            .height(sheetItems * 40 + 8);
                    }, 140);

                    setTimeout(function () {
                        $fab_sheet.addClass('md-fab-active');
                    }, 280);

                });

            $(document).on('click scroll', function (e) {
                if ($fab_sheet.hasClass('md-fab-active')) {
                    if (!$(e.target).closest($fab_sheet).length) {

                        $fab_sheet
                            .css({
                                'height': '',
                                'width': ''
                            })
                            .removeClass('md-fab-active');

                        setTimeout(function () {
                            $fab_sheet.removeClass('md-fab-animated');
                        }, 140);

                    }
                }
            });
        }
    }
    wave_effect() {
        if (!$('html').hasClass('lte-ie9')) {
            Waves.attach('.md-btn-wave,.md-fab-wave', ['waves-button']);
            Waves.attach('.md-btn-wave-light,.md-fab-wave-light', ['waves-button', 'waves-light']);
            Waves.attach('.wave-box', ['waves-float']);
            Waves.init({
                delay: 300
            });
        }
    }
};
