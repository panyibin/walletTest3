//
//  PinInputCollectionViewCell.h
//  NumKeyboardTest
//
//  Created by PanYibin on 2018/3/28.
//  Copyright © 2018年 PanYibin. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, PinInputCollectionViewCellType) {
    PinInputCollectionViewCellTypeNumber,
    PinInputCollectionViewCellTypeBack,
    PinInputCollectionViewCellTypeEmpty,
};

@interface PinInputCollectionViewCell : UICollectionViewCell

@property (nonatomic, assign) NSInteger number;
@property (nonatomic, assign) PinInputCollectionViewCellType cellType;
@property (nonatomic, strong) UIView *highlightView;

@end
