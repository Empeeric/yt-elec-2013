(function(){dust.register("gallery",body_0);function body_0(chk,ctx){return chk.write("<ul>").section(ctx.get("items"),ctx,{"block":body_1},null).write("</ul>");}function body_1(chk,ctx){return chk.write("<li><a href=\"").section(ctx.get("player"),ctx,{"block":body_2},null).write("\" data-id=\"").reference(ctx.get("id"),ctx,"h").write("\"><img src=\"").section(ctx.get("thumbnail"),ctx,{"block":body_3},null).write("\" alt=\"\"><h2>").reference(ctx.get("title"),ctx,"h").write("</h2><div>by <b>").reference(ctx.get("uploader"),ctx,"h").write("</b> ").reference(ctx.get("viewCount"),ctx,"h").write(" views</div></a></li>");}function body_2(chk,ctx){return chk.reference(ctx.get("default"),ctx,"h");}function body_3(chk,ctx){return chk.reference(ctx.get("sqDefault"),ctx,"h");}return body_0;})();