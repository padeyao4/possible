import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Similarly to Material Icons, use [Iconify] Widget to display Iconify.
///
///
/// ```dart
/// import 'package:iconify_flutter/icons/IconsLibrary';
/// HeroIcon(IconsLibrary.arrowLeft)
/// ```

class Iconify extends StatelessWidget {
  final String icon;
  final double? size;

  const Iconify(
    this.icon, {
    super.key,
    this.size = 24,
  });

  @override
  Widget build(BuildContext context) {
    return SvgPicture.string(
      icon,
      colorFilter: Theme.of(context).brightness == Brightness.dark
          ? ColorFilter.matrix([
              -1, 0, 0, 0, 255, // Red
              0, -1, 0, 0, 255, // Green
              0, 0, -1, 0, 255, // Blue
              0, 0, 0, 1, 0, // Alpha
            ])
          : null,
      width: size,
      height: size,
      alignment: Alignment.center,
    );
  }
}
