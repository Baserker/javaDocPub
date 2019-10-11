# javaDOC
Maven插件项目
无需任何依赖，只需要规范注释，就可以通过maven插件生成接口文档


<h1 style="text-align: center">javadoc Maven插件</h1>

####项目简介
javadoc是基于Maven开发的小插件，目前暂时只用于读取SpringMVC和SpringBoot中的Controller信息。

**接口文档界面展示** [https://geningxiang.github.io/javadoc-help/javadoc-ui/](https://geningxiang.github.io/javadoc-help/javadoc-ui/)

####Controller结构
不需要任何的依赖，只需要规范注释，就可以通过maven插件生成接口文档

```
/**
     * 获取文件的路径树
     *
     * @param localPath 文件绝对路径
     * @return {
     * "errorMessage":  //信息
     * "flag":  //标签，0：失败；1：成功。
     * "retTime":   //时间戳
     * "data":  {
     * "name":  //文件名称
     * "localPath":    //绝对路径
     * "parent":    //父目录
     * "urlPath":   //访问链接
     * "childrenList":[     //子目录
     * <p>
     * ]
     * }
     * }
     */
     
```

暂时只上传了私有仓库,如果要体验只能自己加一下 pluginRepository
```
    <!-- 插件仓库地址 -->
    <pluginRepositories>
        <!-- 默认先请求阿里云 -->
        <pluginRepository>
            <id>aliyun</id>
            <url>https://maven.aliyun.com/nexus/content/groups/public/</url>
            <layout>default</layout>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
            <releases>
                <enabled>true</enabled>
            </releases>
        </pluginRepository>
        <!-- 我的私有仓库地址 -->
        <pluginRepository>
            <id>caimao</id>
            <url>http://60.190.13.162:6118/maven/</url>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
            <releases>
                <enabled>true</enabled>
            </releases>
        </pluginRepository>
    </pluginRepositories>
```
```
<plugin>
    <groupId>com.genx.javadoc</groupId>
    <artifactId>javadoc-mvn-plugin</artifactId>
    <version>1.0.1</version>
</plugin>
```

```
mvn package javadoc-mvn:javaDoc
```
   
