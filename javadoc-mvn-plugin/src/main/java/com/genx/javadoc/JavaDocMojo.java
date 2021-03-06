package com.genx.javadoc;

import com.alibaba.fastjson.JSONObject;
import com.genx.javadoc.utils.FileUtil;
import com.genx.javadoc.vo.ClassDocVO;
import org.apache.maven.execution.MavenSession;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecution;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.plugins.annotations.ResolutionScope;
import org.apache.maven.project.MavenProject;
import org.apache.maven.settings.Settings;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import static com.genx.javadoc.utils.ZipUtil.unzip;

/**
 * Created with IntelliJ IDEA.
 * Description:
 *
 * @author: genx
 * @date: 2019/3/11 22:51
 */
@Mojo(name = "javaDoc", defaultPhase = LifecyclePhase.PACKAGE, threadSafe = true,
        requiresDependencyResolution = ResolutionScope.COMPILE)
public class JavaDocMojo extends AbstractMojo {


    @Parameter(defaultValue = "${session}", readonly = true)
    private MavenSession session;

    @Parameter(defaultValue = "${project}", readonly = true)
    private MavenProject project;

    @Parameter(defaultValue = "${mojoExecution}", readonly = true)
    private MojoExecution mojo;

    @Parameter(defaultValue = "${plugin}", readonly = true)
    private PluginDescriptor plugin;

    @Parameter(defaultValue = "${settings}", readonly = true)
    private Settings settings;

    /**
     * 项目根目录
     */
    @Parameter(defaultValue = "${project.basedir}", readonly = true)
    private File basedir;

    /**
     * 项目构建目录，缺省为target
     */
    @Parameter(defaultValue = "${project.build.directory}", readonly = true)
    private File target;

    /**
     * 项目的主源码目录
     */
    @Parameter(defaultValue = "${project.build.sourceDirectory}", readonly = true)
    private File sourceDirectory;

    /**
     * 项目的测试源码目录
     */
    @Parameter(defaultValue = "${project.build.outputDirectory}", readonly = true)
    private File outputDirectory;


//    @Parameter(defaultValue = "${project.build.outputDirectory}/${project.build.finalName}/WEB-INF/lib")
//    private File libDir;

    /**
     * 第三方类
     */
    @Parameter(defaultValue = "${project.compileClasspathElements}", readonly = true, required = true)
    private List<String> compilePath;


    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {

        System.out.println("JavaDocMojo start");


        System.out.println(basedir.getAbsolutePath());

        System.out.println(target.getAbsolutePath());

        System.out.println(sourceDirectory);

        System.out.println(outputDirectory);

//        System.out.println(libDir);

        System.out.println("compilePath:");
        for (String s : compilePath) {
            System.out.println(s);
        }


        if (sourceDirectory == null || !sourceDirectory.exists()) {
            throw new MojoFailureException("sourceDirectory error : " + sourceDirectory);
        }

        if (outputDirectory == null || !outputDirectory.exists()) {
            throw new MojoFailureException("outputDirectory error : " + outputDirectory);
        }

        if (target == null || !target.exists()) {
            throw new MojoFailureException("target error : " + target);
        }

        Map<String, ClassDocVO> map = JavaDocReader.read(sourceDirectory, compilePath);

        File docDir = new File(target.getAbsolutePath() + "/docs");
        docDir.mkdirs();

        String json = JSONObject.toJSONString(map);
        File file = new File(target.getAbsolutePath() + "/docs/javadoc.json");
        FileUtil.writeFile(file, json);

        File file2 = new File(target.getAbsolutePath() + "/docs/javadoc.js");
        FileUtil.writeFile(file2, "var javadoc = " + json + ";");

        copyHtml(docDir);
    }

    private void copyHtml(File dir) {
        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource resource = resourceLoader.getResource("classpath:html.zip");
        if (resource.exists()) {
            try {
                unzip(resource.getInputStream(), dir);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("未找到 classpath:html.zip");
        }
    }
}
