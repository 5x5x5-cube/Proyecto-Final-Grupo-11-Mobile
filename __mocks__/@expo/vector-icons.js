const React = require('react');
const { View } = require('react-native');

const createIconSet = () => {
  const Icon = props => React.createElement(View, props);
  Icon.displayName = 'Icon';
  return Icon;
};

module.exports = {
  MaterialCommunityIcons: createIconSet(),
  Ionicons: createIconSet(),
  FontAwesome: createIconSet(),
  AntDesign: createIconSet(),
  Entypo: createIconSet(),
  Feather: createIconSet(),
  MaterialIcons: createIconSet(),
};
