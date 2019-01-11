<header id="main-header" class="container-fluid no-padding">
    <nav class="header-section">
        <div class="container no-padding">
            <div class="row">
                <div class="col-md-3">
                    <div class="logo">
                        <a href="{{route('home')}}"><img width="186" src="{{ route('image',['link'=>\App\Helpers\Helper::config('logo-site')]) }}" class="logo-image" alt=""/></a>
                    </div>
                </div>

                <div id="sidebar-wrapper">

                    <ul class="sidebar-nav">

                      @php

                        $menus = \App\Helpers\Helper::menus();

                      @endphp

                      @foreach($menus as $menu)

                        @if($menu->pai_id)
                          @continue;
                        @endif

                        <li class="{{ $loop->first ? 'active' : '' }}">
                          @if($menu->filhos->isNotEmpty())
                            <div class="dropdown homepage-list">
                                <button class="btn dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    {{ $menu->nome }}
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                  @foreach($menu->filhos as $filhos)
                                  <li><a href="{{ $filhos->link }}">{{ $filhos->nome }}</a></li>
                                  @endforeach
                                </ul>
                            </div>
                          @else
                            <a href="{{ $menu->link }}">{{ $menu->nome }}</a>
                          @endif
                        </li>

                      @endforeach

                    </ul>
                </div>
                <a href="#menu-toggle" class="" id="menu-toggle"><i class="fa fa-bars"></i></a>
                <div class="col-md-9">
                    <div class="main-nav">
                        <div class="responsive-menu d-text-c-h">
                            <i class="fa fa-bars"></i>
                        </div>
                        <ul class="lst-menu">

                          @php

                            $menus = \App\Helpers\Helper::menus();

                          @endphp

                          @foreach($menus as $menu)

                            @if($menu->pai_id)
                              @continue;
                            @endif

                            <li class="{{ $loop->first ? 'active' : '' }}">
                              @if($menu->filhos->isNotEmpty())
                                <div class="dropdown homepage-list">
                                    <button class="btn dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        {{ $menu->nome }}
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                      @foreach($menu->filhos as $filhos)
                                      <li><a href="{{ $filhos->link }}">{{ $filhos->nome }}</a></li>
                                      @endforeach
                                    </ul>
                                </div>
                              @else
                                <a href="{{ $menu->link }}">{{ $menu->nome }}</a>
                              @endif
                            </li>

                          @endforeach

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</header>
