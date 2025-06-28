
import 'package:mangayomi/mangayomi.dart';
import 'package:html/parser.dart' show parse;
import 'package:html/dom.dart';

class OnePace extends VideoSource {
  @override
  String get name => "OnePace";

  @override
  String get baseUrl => "https://onepace.net";

  @override
  bool get supportsSearch => false;

  @override
  Future<List<Anime>> fetchPopularAnime(int page) async {
    final res = await http.get(Uri.parse("$baseUrl/en/watch"));
    final document = parse(res.body);
    return [
      Anime(
        title: "One Pace",
        url: "/en/watch",
        thumbnailUrl: "https://onepace.net/logo192.png",
        description: "Fan-edited One Piece episodes from One Pace."
      )
    ];
  }

  @override
  Future<List<Episode>> fetchEpisodeList(String animeUrl) async {
    final res = await http.get(Uri.parse("$baseUrl$animeUrl"));
    final document = parse(res.body);
    final List<Episode> episodes = [];

    for (final arc in document.querySelectorAll("section[id]")) {
      final arcTitle = arc.querySelector("h2")?.text.trim() ?? "";
      final epItems = arc.querySelectorAll("ul li");
      for (final item in epItems) {
        final title = item.querySelector("strong")?.text.trim();
        final pixeldrainLink = item.querySelectorAll("a").firstWhere(
          (a) => a.text.contains("Pixeldrain") && !a.text.contains("Dub"),
          orElse: () => null,
        );
        if (pixeldrainLink != null && title != null) {
          episodes.add(Episode(
            name: "$arcTitle - $title",
            url: pixeldrainLink.attributes['href']!,
          ));
        }
      }
    }

    return episodes;
  }

  @override
  Future<List<Video>> fetchVideoList(String episodeUrl) async {
    return [
      Video(
        url: episodeUrl,
        quality: "Pixeldrain (Sub)",
        headers: {"Referer": baseUrl},
      )
    ];
  }
}
