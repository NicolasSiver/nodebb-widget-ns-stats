<div class="widget-stats">
    <div class="forums-stats">
        <div class="posts"><i class="fa fa-pencil"></i> {stats.posts}</div>
        <div class="topics"><i class="fa fa-comment-o"></i> {stats.topics}</div>
        <div class="users"><i class="fa fa-user"></i> {stats.users}</div>
    </div>

    <!-- IF online.length -->
    <div class="list-title">{onlineTitle}</div>

    <div class="users-online">
        <!-- BEGIN online -->
        <span class="user-item"><a href="{relative_path}/user/{online.userslug}">{online.username}</a></span>
        <!-- END online -->
    </div>
    <!-- ENDIF online.length -->

    <!-- IF today.length -->
    <div class="list-title">{visitorsTitle}</div>

    <div class="users-today">
        <!-- BEGIN today -->
        <span class="user-item"><a href="{relative_path}/user/{today.userslug}">{today.username}</a></span>
        <!-- END today -->
    </div>
    <!-- ENDIF today.length -->
</div>
