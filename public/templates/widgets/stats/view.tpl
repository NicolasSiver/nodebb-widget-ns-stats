<div class="widget-stats">
    <div class="forums-stats">
        <div class="posts"><i class="fa fa-pencil"></i> {stats.posts}</div>
        <div class="topics"><i class="fa fa-comment-o"></i> {stats.topics}</div>
        <div class="users"><i class="fa fa-user"></i> {stats.users}</div>
    </div>
    
    <!-- IF today.length -->
    <span>Visited today:</span>

    <div class="users-visited-today">
        <!-- BEGIN today -->
        <span class="user-today-item"><a href="{relative_path}/user/{today.userslug}">{today.name}</a></span>
        <!-- END today -->
    </div>
    <!-- ENDIF today.length -->
</div>
