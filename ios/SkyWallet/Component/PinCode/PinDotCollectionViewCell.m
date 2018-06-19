//
//  PinDotCollectionViewCell.m
//  NumKeyboardTest
//
//  Created by PanYibin on 2018/3/28.
//  Copyright © 2018年 PanYibin. All rights reserved.
//

#import "PinDotCollectionViewCell.h"
#import <Masonry.h>

@implementation PinDotCollectionViewCell

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
        
        _dotView = [[UIView alloc] init];
        [self.contentView addSubview:_dotView];
        
        CGFloat dotViewWidth = 15;
        
        [_dotView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.mas_equalTo(self.contentView);
            make.width.mas_equalTo(dotViewWidth);
            make.height.mas_equalTo(dotViewWidth);
        }];
        
        _dotView.clipsToBounds = YES;
        _dotView.layer.cornerRadius = dotViewWidth/2;
    }
    
    return self;
}

@end
