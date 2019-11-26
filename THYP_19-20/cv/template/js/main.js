var form1 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv";
var form2 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTDaWciiOoWzdcJ2FicK9v9CN64A7T7kfxiEck4rhGoO3jg6Wt4H2Mn4JBotZ4D1WS8yzuMQiuoAcqA/pub?output=csv";
var dataForm1 = null;
var dataForm2 = null;
var BClist = [];
var values = {"Pas besoin":1, "Besoin d'approfondissement":2, "Besoin urgent":3, "je ne connais pas du tout":0,"je connais un peu":1,"je connais bien":2,"je suis expert(e)":3};
var description = "";

$( document ).ready(function() {
	var q = d3.csv(form1)
		  .then(function(data) {
            initCV(data);
		  })
		  .catch(function(error){
		     alert(error+', delete cache and refresh');
          });

	var q = d3.csv(form2)
        .then(function(data) {
            initDataForm2(data);
        })
        .catch(function(error){
            console.log(error);
        });
});

function initDataForm2(data){
    dataForm2 = data;
    if(dataForm1 != null){
        url = window.location.href;
        if(url.includes('cv/template')){
            data_url = url.split('cv/template/#');
            if(data_url.length > 1){
                if(!changeData(data_url[1]))
                    changeData('18910433');
            }else
                changeData('18910433');
        }else
            changeDataGlobal();
    }
}

function initCV(data){
    dataForm1 = data;
    data.forEach(element => { 
        $("#classroom").append('<li id="'+element['N° étudiant']+'"><a href="#'+element['N° étudiant']+'">'+element['Votre prénom']+' '+element['Votre nom']+'</a></li>');
    });

    $("#classroom li").each(function(){
        $("#"+this.id).click(function() {
            changeData(this.id);
        });
    }); 
    
    initBC();
    $('#getStats').click(function() {
        changeDataGlobal();
    });

    if(dataForm2 != null){
        url = window.location.href;
        if(url.includes('cv/template')){
            data_url = url.split('cv/template/#');
            if(data_url.length > 1){
                if(!changeData(data_url[1]))
                    changeData('18910433');
            }else
                changeData('18910433');
        }else
            changeDataGlobal();
    }
}

function changeData(id){
    var d1 = [];
    var d2 = [];

    dataForm1.forEach(element => { 
        if(element['N° étudiant'] == id)
            d1 = element;
    });
    dataForm2.forEach(element => { 
        if(element['Num étudiant'] == id)
            d2 = element;
    });

    if(typeof d1['N° étudiant'] !== 'undefined'){
        changeData2(d2);
        changeData1(d1);
        return true;
    }else
        return false;
}

function initBC(){
    var columns = dataForm1.columns;
    columns.forEach(function(element){
        if(element.includes('Quelles sont vos compétences ?')){
            start = element.indexOf("[") + 1;
            end = element.indexOf("]");
            BClist.push(element.substring(start, end));
        }
    });
}

function changeDataGlobal(){
    $("#big_name").html('THYP');
    $("#name").html("Technologies de l'Hypermédia");
    $("#photo").css("background-image", "url(cv/template/images/p8.jpg)");
    $("#mail").html("hyper@hymedia.univ-paris8.fr");
    $("#mail").attr("href", "mailto:hyper@hymedia.univ-paris8.fr");
    $("#diigo").attr("href", "#");
    $("#diigo").html("");
    $("#netvibes").html("");
    $("#git").attr("href", "https://github.com/samszo/THYP_19-20");
    $("#description").html("Ce Master permet aux étudiants d’acquérir des compétences variées et complémentaires leur permettant de s’adapter dans les meilleures conditions à la plupart des missions industrielles et/ou de recherche.<br><br>");
    $("#veille").hide();
    $("#skills").hide();
    $("#projects").hide();
    $("#download_cv").hide();
    $("#stats").show();
    globalBesoinCompetence();
}

function globalBesoinCompetence(){
    $("#stat_g").html('');
    BClist.forEach(function(element){
        var tmp = "";
        var exp = "";
        var com = "";
        var bes = "";
        var urg = "";
        var total_c = 0;
        var total_b = 0;
        var nb_exp = 0;
        var nb_com = 0;
        var nb_bes = 0;
        var nb_urg = 0;
        $("#stat_l").append('<li class="portfolio_category" id="'+element+'">'+ucFirst(element)+'</li>');

        for(var i=0; i<dataForm1.length; i++){
            if(values[dataForm1[i]['Quelles sont vos compétences ? ['+element+']']] == 2){
                com = com+dataForm1[i]['Votre prénom']+' '+dataForm1[i]['Votre nom']+'<br>';
                total_c++;
                nb_com+=0.5;
            }
            if(values[dataForm1[i]['Quelles sont vos compétences ? ['+element+']']] == 3){
                exp = exp+dataForm1[i]['Votre prénom']+' '+dataForm1[i]['Votre nom']+'<br>';
                total_c++;
                nb_exp+=1;
            }
            if(values[dataForm1[i]['Quelles sont besoins ? ['+element+']']] == 2){
                bes = bes+dataForm1[i]['Votre prénom']+' '+dataForm1[i]['Votre nom']+'<br>';
                total_b++;
                nb_bes+=0.5;
            }
            if(values[dataForm1[i]['Quelles sont besoins ? ['+element+']']] == 3){
                urg = urg+dataForm1[i]['Votre prénom']+' '+dataForm1[i]['Votre nom']+'<br>';
                total_b++;
                nb_urg+=1;
            }
        }

        total_com = ((nb_com+nb_exp)/total_c)*100;
        total_bes = ((nb_bes+nb_urg)/total_b)*100;
    
        miles1 = '<div class="milestone text-center"><div class="milestone_icon"><img src="cv/template/images/icon_8.png" alt=""></div><div class="milestone_counter" data-end-value="'+Math.round((total_c/(total_c+total_b))*100)+'" data-sign-after="%">0</div><div class="milestone_text">Elèves compétent</div></div>';
        miles2 = '<div class="milestone text-center"><div class="milestone_icon"><img src="cv/template/images/icon_9.png" alt=""></div><div class="milestone_counter" data-end-value="'+Math.round(total_com)+'" data-sign-after="%">0</div><div class="milestone_text">Niveau de maitrise</div></div>';
        miles3 = '<div class="milestone text-center"><div class="milestone_icon"><img src="cv/template/images/icon_10.png" alt=""></div><div class="milestone_counter" data-end-value="'+Math.round(total_bes)+'" data-sign-after="%">0</div><div class="milestone_text">Urgence du besoin</div></div>';
        miles = '<div class="milestones clearfix">'+ miles1 + miles2 + miles3 +'</div>';
        tmp = "<div class='owl-item test_item' data-name='"+element+"'><div class='test_title'>"+ucFirst(element)+"</div>"+miles+"<div class='test_text'><div class='row'><div class='col-md-3'><div class='test_info'>Expert</div><p>"+exp+"</p></div><div class='col-md-3'><div class='test_info'>Compétent</div><p>"+com+"</p></div><div class='col-md-3'><div class='test_info'>Approfondissement</div><p>"+bes+"</p></div><div class='col-md-3'><div class='test_info'>Urgent</div><p>"+urg+"</p></div></div></div></div>";
        $("#stat_g").append(tmp);
    });
    initMilestones();
    $("#stat_l li").each(function(){
        $("[id='"+this.id+"']").click(function() {
            changeStat(this.id);
        });
    }); 

}

function changeStat(name){
    if(name == 'all'){
        $('.owl-item').each(function(index){
            $('.owl-item')[index].style.display = 'block';
        });
    }else{
        $('.owl-item').each(function(index){
            $('.owl-item')[index].style.display = 'none';
        });
        $('[data-name="'+name+'"]')[0].style.display = 'block';
    }
    initMilestones();
}

function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function changeData1(data){
    $("#big_name").html(data['Votre prénom']+' '+data['Votre nom']);
    $("#name").html(data['Votre prénom']+' '+data['Votre nom']);
    $("#photo").css("background-image", "url("+getUrlImg(data['Votre photo'])+")");
    $("#mail").html(data['Votre mail']);
    $("#mail").attr("href", "mailto:"+data['Votre mail']);
    $("#diigo").attr("href", "https://www.diigo.com/user/"+data['Votre compte Diigo']);
    $("#diigo").html(data['Votre compte Diigo']);
    $("#netvibes").html(data['Votre compte NetVibes']);
    $("#git").attr("href", "https://github.com/"+data['Votre compte GitHub']);
    $("#veille").show();
    $("#skills").show();
    $("#stats").hide();
    setBesoin(data);
    setCompetence(data);
    setOutil(data);
    setFramework(data);
    setLanguage(data);
    setLangage(data);
    setReseau(data);
    initLoaders();
    initProgressBars();
    closeMenu();
}

function changeData2(data){
    if(data.length !== 0){

        description = data['Courte description de vous'];
        
        if(data['Lien projet 1'] == "" && data['Lien projet 2'] == "" && data['Lien projet 3'] == ""){
            $("#projects").hide();
        }else{
            $("#projects").show();
    
            if(data['Lien projet 1'] == ""){
                $("#project_1").hide();
            }else{
                $("#project_1").show();
                $("#image_project_1").attr("src", getUrlImg(data['Photo projet 1']));
                $("#link_project_1").attr("href", data['Lien projet 1']);
            }
    
            if(data['Lien projet 2'] == ""){
                $("#project_2").hide();
            }else{
                $("#project_2").show();
                $("#image_project_2").attr("src", getUrlImg(data['Photo projet 2']));
                $("#link_project_2").attr("href", data['Lien projet 2']);
            }
    
            if(data['Lien projet 3'] == ""){
                $("#project_3").hide();
            }else{
                $("#project_3").show();
                $("#image_project_3").attr("src", getUrlImg(data['Photo projet 3']));
                $("#link_project_3").attr("href", data['Lien projet 3']);
            }
        }
    
        if(data['Votre cv'] == ""){
            $("#download_cv").hide();
        }{
            $("#download_cv").show();
            $("#cv").attr("href", data['Votre cv']);
        }

        if(data['Votre compte linkedin'] == ""){
            $("#linkedin").hide();            
        }else{
            $("#linkedin").show();
            $("#linkedin").attr("href", "https://www.linkedin.com/in/"+data['Votre compte linkedin']);
        }

        if(data['Votre compte skype'] == ""){
            $("#skype").hide();            
        }else{
            $("#skype").show();
            $("#skype").attr("href", "skype:"+data['Votre compte skype']);
        }
        
    }else{
        description="";
        $("#projects").hide();
        $("#download_cv").hide();
        $("#linkedin").hide();
        $("#skype").hide();
    }
}

function getUrlImg(photo) {  
	if(photo=="#" || photo==null || photo=="") return "#";
	var url = new URL(photo);
    let urlParam = new URLSearchParams(url.search);
    let id = urlParam.get('id');
    //merci à https://stackoverflow.com/questions/50664868/get-pictures-from-google-drive-folder-with-javascript-to-my-website
    return "https://drive.google.com/uc?id="+id+"&export=download"; 
}

function setBesoin(data){
    var total = 0;
    var nb = 0;

    if(values[data["Quelles sont besoins ? [connaître les outils d’édition web (éditeurs html, CSS, …) ]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [connaître les outils d’édition web (éditeurs html, CSS, …) ]"]];
    }
    if(values[data["Quelles sont besoins ? [connaître les base du langage HTML 5]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [connaître les base du langage HTML 5]"]];
    }
    if(values[data["Quelles sont besoins ? [connaître les bases du responsive web design (RWD)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [connaître les bases du responsive web design (RWD)]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir scénariser et réaliser les rubriques « statiques » d’un site web]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir scénariser et réaliser les rubriques « statiques » d’un site web]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir scénariser et réaliser des rubriques multimédias (« page vidéo », « page photo », exposition virtuelle, …)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir scénariser et réaliser des rubriques multimédias (« page vidéo », « page photo », exposition virtuelle, …)]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir utiliser des cartes géographiques interactives]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir utiliser des cartes géographiques interactives]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir travailler avec le RSS]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir travailler avec le RSS]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir utiliser correctement les métadonnées pour une meilleure diffusion des contenus du site]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir utiliser correctement les métadonnées pour une meilleure diffusion des contenus du site]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir utiliser les programmes de liens sponsorisés]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir utiliser les programmes de liens sponsorisés]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir utiliser des outils de gestion d’accès aux rubriques (accès par mot de passe, …)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir utiliser des outils de gestion d’accès aux rubriques (accès par mot de passe, …)]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir mettre en place et gérer un forum de discussion]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir mettre en place et gérer un forum de discussion]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir mettre en place et gérer un service de type « newsletter » (impliquant la mise en place et la gestion d’un annuaire d’abonnés)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir mettre en place et gérer un service de type « newsletter » (impliquant la mise en place et la gestion d’un annuaire d’abonnés)]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir mettre en place des enquêtes]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir mettre en place des enquêtes]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir mettre en place et exploiter des outils de veille d’information]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir mettre en place et exploiter des outils de veille d’information]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir mettre en place des outils de type « ranking »]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir mettre en place des outils de type « ranking »]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir intégrer, dans un page, des outils de diffusion web 2 (twitter, facebook, …)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir intégrer, dans un page, des outils de diffusion web 2 (twitter, facebook, …)]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir faire fonctionner, sur un site, un service de type « e-commerce » (vente de produits, …)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir faire fonctionner, sur un site, un service de type « e-commerce » (vente de produits, …)]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir réaliser et diffuser des e-publications : brochures, dépliants, publications multimédias, …]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir réaliser et diffuser des e-publications : brochures, dépliants, publications multimédias, …]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir réaliser des podcasts]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir réaliser des podcasts]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir gérer la publication à distance d’un site web]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir gérer la publication à distance d’un site web]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir gérer un site multilingue]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir gérer un site multilingue]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir gérer une communauté en ligne]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir gérer une communauté en ligne]"]];
    }
    if(values[data["Quelles sont besoins ? [analyser des bases de données]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [analyser des bases de données]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir prototyper des innovations numériques]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir prototyper des innovations numériques]"]];
    }
    if(values[data["Quelles sont besoins ? [savoir gérer un projet]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [savoir gérer un projet]"]];
    }
    if(values[data["Quelles sont besoins ? [utiliser les méthodes agiles de développement]"]]>1){
        nb++;
        total = total + values[data["Quelles sont besoins ? [utiliser les méthodes agiles de développement]"]];
    }

    if(nb > 0)
        total = total/(3*nb);
    $("#besoin").html("");
    $('#besoin').data().perc = total;
}

function setCompetence(data){
    var total = 0;
    var nb = 0;

    if(values[data["Quelles sont vos compétences ? [connaître les outils d’édition web (éditeurs html, CSS, …) ]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [connaître les outils d’édition web (éditeurs html, CSS, …) ]"]];
    }
    if(values[data["Quelles sont vos compétences ? [connaître les base du langage HTML 5]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [connaître les base du langage HTML 5]"]];
    }
    if(values[data["Quelles sont vos compétences ? [connaître les bases du responsive web design (RWD)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [connaître les bases du responsive web design (RWD)]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir scénariser et réaliser les rubriques « statiques » d’un site web]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir scénariser et réaliser les rubriques « statiques » d’un site web]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir scénariser et réaliser des rubriques multimédias (« page vidéo », « page photo », exposition virtuelle, …)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir scénariser et réaliser des rubriques multimédias (« page vidéo », « page photo », exposition virtuelle, …)]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir utiliser des cartes géographiques interactives]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir utiliser des cartes géographiques interactives]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir travailler avec le RSS]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir travailler avec le RSS]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir utiliser correctement les métadonnées pour une meilleure diffusion des contenus du site]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir utiliser correctement les métadonnées pour une meilleure diffusion des contenus du site]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir utiliser les programmes de liens sponsorisés]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir utiliser les programmes de liens sponsorisés]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir utiliser des outils de gestion d’accès aux rubriques (accès par mot de passe, …)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir utiliser des outils de gestion d’accès aux rubriques (accès par mot de passe, …)]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir mettre en place et gérer un forum de discussion]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir mettre en place et gérer un forum de discussion]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir mettre en place et gérer un service de type « newsletter » (impliquant la mise en place et la gestion d’un annuaire d’abonnés)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir mettre en place et gérer un service de type « newsletter » (impliquant la mise en place et la gestion d’un annuaire d’abonnés)]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir mettre en place des enquêtes enligne]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir mettre en place des enquêtes enligne]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir mettre en place et exploiter des outils de veille d’information]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir mettre en place et exploiter des outils de veille d’information]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir mettre en place des outils de type « ranking »]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir mettre en place des outils de type « ranking »]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir intégrer, dans un page, des outils de diffusion web 2 (twitter, facebook, …)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir intégrer, dans un page, des outils de diffusion web 2 (twitter, facebook, …)]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir faire fonctionner, sur un site, un service de type « e-commerce » (vente de produits, …)]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir faire fonctionner, sur un site, un service de type « e-commerce » (vente de produits, …)]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir réaliser et diffuser des e-publications : brochures, dépliants, publications multimédias, …]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir réaliser et diffuser des e-publications : brochures, dépliants, publications multimédias, …]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir réaliser des podcasts]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir réaliser des podcasts]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir gérer la publication à distance d’un site web]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir gérer la publication à distance d’un site web]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir gérer un site multilingue]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir gérer un site multilingue]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir gérer une communauté en ligne]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir gérer une communauté en ligne]"]];
    }
    if(values[data["Quelles sont vos compétences ? [analyser des bases de données]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [analyser des bases de données]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir prototyper des innovations numériques]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir prototyper des innovations numériques]"]];
    }
    if(values[data["Quelles sont vos compétences ? [savoir gérer un projet]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [savoir gérer un projet]"]];
    }
    if(values[data["Quelles sont vos compétences ? [utiliser les méthodes agiles de développement]"]]>1){
        nb++;
        total = total + values[data["Quelles sont vos compétences ? [utiliser les méthodes agiles de développement]"]];
    }

    if(nb > 0)
        total = total/(3*nb);
    $("#competence").html("");
    $('#competence').data().perc = total;
}

function setOutil(data){
    var total = 0;
    var nb = 0;

    if(values[data["Quelles outils utilisez vous ? [Photoshop]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Photoshop]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Illustrator]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Illustrator]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Gimp]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Gimp]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Inkscape]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Inkscape]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Dreamweaver]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Dreamweaver]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Kompozer]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Kompozer]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Premier]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Premier]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [After Effect]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [After Effect]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Eclipse]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Eclipse]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Sublime text]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Sublime text]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [In design]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [In design]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Final Cut]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Final Cut]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Blender]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Blender]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Sketchup]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Sketchup]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Unity]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Unity]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Wamp]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Wamp]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Xamp]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Xamp]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Mamp]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Mamp]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [PhpMyAdmin]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [PhpMyAdmin]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [MySqlWorkbench]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [MySqlWorkbench]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Cordova]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Cordova]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Bracket]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Bracket]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Flash]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Flash]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [R]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [R]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Visual Studio Code]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Visual Studio Code]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Ansible]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Ansible]"]];
    }
    if(values[data["Quelles outils utilisez vous ? [Ligne 29]"]]>1){
        nb++;
        total = total + values[data["Quelles outils utilisez vous ? [Ligne 29]"]];
    }

    if(nb > 0)
        total = total/(3*nb);
    $("#outil").html("");
    $('#outil').data().perc = total;
}

function setLangage(data){
    var total = 0;
    var nb = 0;

    if(values[data['Quelles langues parlez vous ? [français]']]>1){
        nb++;
        total = total + values[data['Quelles langues parlez vous ? [français]']];
    }
    if(values[data['Quelles langues parlez vous ? [anglais]']]>1){
        nb++;
        total = total + values[data['Quelles langues parlez vous ? [anglais]']];
    }
    if(values[data['Quelles langues parlez vous ? [espagnol]']]>1){
        nb++;
        total = total + values[data['Quelles langues parlez vous ? [espagnol]']];
    }
    if(values[data['Quelles langues parlez vous ? [arabe]']]>1){
        nb++;
        total = total + values[data['Quelles langues parlez vous ? [arabe]']];
    }
    if(values[data['Quelles langues parlez vous ? [tamazirth]']]>1){
        nb++;
        total = total + values[data['Quelles langues parlez vous ? [tamazirth]']];
    }
    if(values[data['Quelles langues parlez vous ? [chinois]']]>1){
        nb++;
        total = total + values[data['Quelles langues parlez vous ? [chinois]']];
    }
    if(values[data['Quelles langues parlez vous ? [russe]']]>1){
        nb++;
        total = total + values[data['Quelles langues parlez vous ? [russe]']];
    }

    if(nb > 0)
        total = total/(3*nb);
    
    $("#langue").html("");
    $('#langue').data().perc = total;
}

function setFramework(data){
    
    if(values[data['Quelles framework utilisez vous ? [Jenkins]']]>0){
        $("#skill_1_pbar_section").show();
        $("#skill_1_pbar").html("");
        $('#skill_1_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Jenkins]']]/3;
    }else
        $("#skill_1_pbar_section").hide();
        
    if(values[data['Quelles framework utilisez vous ? [Hibernate]']]>0){
        $("#skill_2_pbar_section").show();
        $("#skill_2_pbar").html("");
        $('#skill_2_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Hibernate]']]/3;
    }else
        $("#skill_2_pbar_section").hide();

    if(values[data['Quelles framework utilisez vous ? [Bootstrap]']]>0){
        $("#skill_3_pbar_section").show();
        $("#skill_3_pbar").html("");
        $('#skill_3_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Bootstrap]']]/3;
    }else
        $("#skill_3_pbar_section").hide();

    if(values[data['Quelles framework utilisez vous ? [laravel]']]>0){
        $("#skill_4_pbar_section").show();
        $("#skill_4_pbar").html("");
        $('#skill_4_pbar').data().perc = values[data['Quelles framework utilisez vous ? [laravel]']]/3;
    }else
        $("#skill_4_pbar_section").hide();

    if(values[data['Quelles framework utilisez vous ? [Zend]']]>0){
        $("#skill_5_pbar_section").show();
        $("#skill_5_pbar").html("");
        $('#skill_5_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Zend]']]/3;
    }else
        $("#skill_5_pbar_section").hide();

    if(values[data['Quelles framework utilisez vous ? [Angular]']]>0){
        $("#skill_6_pbar_section").show();
        $("#skill_6_pbar").html("");
        $('#skill_6_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Angular]']]/3;
    }else
        $("#skill_6_pbar_section").hide();

    if(values[data['Quelles framework utilisez vous ? [Flesk]']]>0){
        $("#skill_7_pbar_section").show();
        $("#skill_7_pbar").html("");
        $('#skill_7_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Flesk]']]/3;
    }else
        $("#skill_7_pbar_section").hide();

    if(values[data['Quelles framework utilisez vous ? [React]']]>0){
        $("#skill_8_pbar_section").show();
        $("#skill_8_pbar").html("");
        $('#skill_8_pbar').data().perc = values[data['Quelles framework utilisez vous ? [React]']]/3;
    }else
        $("#skill_8_pbar_section").hide();
        
    if(values[data['Quelles framework utilisez vous ? [Vue]']]>0){
        $("#skill_9_pbar_section").show();
        $("#skill_9_pbar").html("");
        $('#skill_9_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Vue]']]/3;
    }else
        $("#skill_9_pbar_section").hide();
        
    if(values[data['Quelles framework utilisez vous ? [Symphony]']]>0){
        $("#skill_10_pbar_section").show();
        $("#skill_10_pbar").html("");
        $('#skill_10_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Symphony]']]/3;
    }else
        $("#skill_10_pbar_section").hide();
        
    if(values[data['Quelles framework utilisez vous ? [Django]']]>0){
        $("#skill_11_pbar_section").show();
        $("#skill_11_pbar").html("");
        $('#skill_11_pbar').data().perc = values[data['Quelles framework utilisez vous ? [Django]']]/3;
    }else
        $("#skill_11_pbar_section").hide();
        
    if(values[data['Quelles framework utilisez vous ? [.Net]']]>0){
        $("#skill_12_pbar_section").show();
        $("#skill_12_pbar").html("");
        $('#skill_12_pbar').data().perc = values[data['Quelles framework utilisez vous ? [.Net]']]/3;
    }else
        $("#skill_12_pbar_section").hide();

}

function setLanguage(data){
    var total = "";

    if(values[data['Quelles langages utilisez vous ? [C]']]>0)
        total = total + '<span class="general_lang">C</span> ';
    if(values[data['Quelles langages utilisez vous ? [C++]']]>0)
        total = total + '<span class="general_lang">C++</span> ';
    if(values[data['Quelles langages utilisez vous ? [PHP]']]>0)
        total = total + '<span class="general_lang">PHP</span> ';
    if(values[data['Quelles langages utilisez vous ? [Java]']]>0)
        total = total + '<span class="general_lang">Java</span> ';
    if(values[data['Quelles langages utilisez vous ? [C#]']]>0)
        total = total + '<span class="general_lang">C#</span> ';
    if(values[data['Quelles langages utilisez vous ? [javascript]']]>0)
        total = total + '<span class="general_lang">JavaScript</span> ';
    if(values[data['Quelles langages utilisez vous ? [cobol]']]>0)
        total = total + '<span class="general_lang">Cobol</span> ';
    if(values[data['Quelles langages utilisez vous ? [python]']]>0)
        total = total + '<span class="general_lang">Python</span> ';
    if(values[data['Quelles langages utilisez vous ? [Objectif C]']]>0)
        total = total + '<span class="general_lang">Objectif C</span> ';
    if(values[data['Quelles langages utilisez vous ? [Android]']]>0)
        total = total + '<span class="general_lang">Android</span> ';
        
    $("#description").html(description+"<br><br>"+total);    
}

function setReseau(data){

}